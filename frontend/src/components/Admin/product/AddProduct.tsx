import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { postProduct } from "../../../../api/product.api";
import { getCategories } from "../../../../api/category.api.ts";
import { uploadToCloudinary } from "../../../lib/cloudinary.ts";
import { getAllAttributes, getAttributeValues } from "../../../../api/attribute.api.ts";
import * as yup from "yup";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useDropzone } from "react-dropzone";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import { ToastSucess, ToastError } from "../../../utils/toast";

type AddProductForm = {
  name: string;
  category_id: string;
  description?: string;
  status?: "active" | "disabled" | "new" | "bestseller";
  sku?: string;
  average_rating?: number;
  total_sold?: number;
  variants: {
    price: number;
    quantity: number;
    image?: string;
    import_price?: number; // Thêm trường import_price
    attributes: { attribute_id: string; value_id: string }[];
  }[];
};

// Cấu hình toolbar cho React Quill, bao gồm nút chèn ảnh
const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "image"],
    ["clean"],
  ],
};

const AddProduct = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<any[]>([]);
  const [attributes, setAttributes] = useState<any[]>([]);
  const [attributeValues, setAttributeValues] = useState<any[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [albumFiles, setAlbumFiles] = useState<File[]>([]);
  const [variantImages, setVariantImages] = useState<(File | null)[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingVariants, setExistingVariants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [formattedPrices, setFormattedPrices] = useState<string[]>([]);
  const [formattedImportPrices, setFormattedImportPrices] = useState<string[]>([]); // Thêm state cho format import_price

  const validationSchema = yup.object().shape({
    name: yup
      .string()
      .required("Tên sản phẩm là bắt buộc")
      .min(2, "Tên sản phẩm phải từ 2 đến 100 ký tự")
      .max(100, "Tên sản phẩm phải từ 2 đến 100 ký tự"),
    category_id: yup.string().required("Bắt buộc chọn danh mục"),
    description: yup.string().optional().nullable(),
    sku: yup.string().nullable().transform((value) => (value?.trim() === "" ? null : value)),
    average_rating: yup.number().optional(),
    total_sold: yup.number().optional(),
    status: yup.string().oneOf(["active", "disabled", "new", "bestseller"]).nullable(),
    variants: yup.array().of(
      yup.object().shape({
        price: yup
          .number()
          .required("Giá là bắt buộc")
          .min(0, "Giá không được âm")
          .typeError("Giá phải là một số"),
        quantity: yup
          .number()
          .required("Số lượng là bắt buộc")
          .min(0, "Số lượng không được âm")
          .typeError("Số lượng phải là một số"),
        image: yup.mixed().nullable(),
        import_price: yup // Thêm validation cho import_price
          .number()
          .required("Giá nhập là bắt buộc")
          .min(0, "Giá nhập không được âm")
          .typeError("Giá nhập phải là một số")
          .lessThan(yup.ref("price"), "Giá nhập phải nhỏ hơn giá bán"),
        attributes: yup
          .array()
          .of(
            yup.object().shape({
              attribute_id: yup.string().required("Bắt buộc chọn thuộc tính"),
              value_id: yup.string().required("Bắt buộc chọn giá trị"),
            })
          )
          .min(1, "Phải có ít nhất một thuộc tính")
          .test(
            "unique-attributes-in-variant",
            "Các thuộc tính trong cùng một biến thể không được trùng lặp",
            (attributes) => {
              if (!attributes) return true;
              const attributeKeys = attributes.map(
                (attr) => `${attr.attribute_id}-${attr.value_id}`
              );
              const uniqueKeys = new Set(attributeKeys);
              return uniqueKeys.size === attributeKeys.length;
            }
          )
          .test(
            "unique-attributes-across-variants",
            "Tổ hợp thuộc tính này đã tồn tại trong một biến thể khác",
            (attributes, context) => {
              const currentKey = attributes
                ?.map((attr) => `${attr.attribute_id}-${attr.value_id}`)
                .sort()
                .join("|") || "";
              const allVariants = context.from?.[1]?.value?.variants || [];
              const variantKeys = allVariants
                .filter((_: any, idx: any) => idx !== context.options.index)
                .map((v: any) =>
                  v.attributes
                    .map((attr: any) => `${attr.attribute_id}-${attr.value_id}`)
                    .sort()
                    .join("|")
                );
              return !variantKeys.includes(currentKey);
            }
          )
          .test(
            "no-duplicate-with-existing",
            "Biến thể này đã tồn tại trong hệ thống",
            (attributes) => {
              const currentKey = attributes
                ?.map((attr) => `${attr.attribute_id}-${attr.value_id}`)
                .sort()
                .join("|") || "";
              return !existingVariants.some((existing) => {
                const existingKey = existing.attributes
                  .map((attr: any) => `${attr.attribute_id}-${attr.value_id}`)
                  .sort()
                  .join("|");
                return existingKey === currentKey;
              });
            }
          ),
      })
    ).min(1, "Phải có ít nhất một biến thể"),
  });

  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    watch,
    trigger,
    formState: { errors },
  } = useForm<AddProductForm>({
    resolver: yupResolver(validationSchema),
    mode: "onChange",
    context: {
      getIndex: (attributesRef: any, variants: any[]) => {
        return variants.findIndex((v) => v.attributes === attributesRef);
      },
    },
    defaultValues: {
      variants: [{ price: undefined, quantity: 0, import_price: 0, attributes: [{ attribute_id: "", value_id: "" }] }], // Thêm default cho import_price
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
  });

  useEffect(() => {
    trigger("variants");
  }, [watch("variants"), trigger]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [catRes, attrRes] = await Promise.all([getCategories(), getAllAttributes()]);
        setCategories(catRes.data?.data || []);
        setAttributes(attrRes.data?.data || []);

        const attrIds = attrRes.data?.data?.map((attr: any) => attr._id) || [];
        const valuesPromises = attrIds.map((id: string) => getAttributeValues(id));
        const valuesRes = await Promise.all(valuesPromises);
        const allValues = valuesRes.flatMap((res) => res.data?.data || []);
        setAttributeValues(allValues);

        setExistingVariants([]);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
        ToastError("Không thể tải dữ liệu. Vui lòng kiểm tra kết nối hoặc thử lại sau.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatNumber = (value: string) => {
    const cleanedValue = value.replace(/[^0-9]/g, "");
    return cleanedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handlePriceChange = (index: number, value: string) => {
    const rawValue = value.replace(/,/g, "");
    setFormattedPrices((prev) => {
      const newPrices = [...prev];
      newPrices[index] = formatNumber(rawValue);
      return newPrices;
    });
    setValue(`variants.${index}.price`, rawValue ? Number(rawValue) : undefined);
    trigger(`variants.${index}.price`);
  };

  const handleImportPriceChange = (index: number, value: string) => { // Thêm hàm xử lý format cho import_price
    const rawValue = value.replace(/,/g, "");
    setFormattedImportPrices((prev) => {
      const newPrices = [...prev];
      newPrices[index] = formatNumber(rawValue);
      return newPrices;
    });
    setValue(`variants.${index}.import_price`, rawValue ? Number(rawValue) : undefined);
    trigger(`variants.${index}.import_price`);
  };

  const { getRootProps: getImageRootProps, getInputProps: getImageInputProps } = useDropzone({
    accept: {
      "image/jpeg": [".jpeg", ".jpg"],
      "image/png": [".png"],
      "image/gif": [".gif"],
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setImageFile(acceptedFiles[0]);
      } else {
        ToastError("Hình ảnh phải có định dạng jpg, png hoặc gif");
      }
    },
  });

  const { getRootProps: getAlbumRootProps, getInputProps: getAlbumInputProps } = useDropzone({
    accept: {
      "image/jpeg": [".jpeg", ".jpg"],
      "image/png": [".png"],
      "image/gif": [".gif"],
    },
    multiple: true,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.every((file) => ["image/jpeg", "image/png", "image/gif"].includes(file.type))) {
        setAlbumFiles(acceptedFiles);
      } else {
        ToastError("Tất cả hình ảnh trong album phải có định dạng jpg, png hoặc gif");
      }
    },
  });

  // Hàm xử lý tải ảnh lên Cloudinary và chèn vào React Quill
  const handleImageUpload = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (file && ["image/jpeg", "image/png", "image/gif"].includes(file.type)) {
        try {
          const imageUrl = await uploadToCloudinary(file);
          const quill = (document.querySelector(".ql-editor") as any)?.quill;
          if (quill) {
            const range = quill.getSelection();
            if (range) {
              quill.insertEmbed(range.index, "image", imageUrl);
            }
          }
        } catch (error) {
          console.error("Lỗi khi tải ảnh lên:", error);
          ToastError("Không thể tải ảnh lên. Vui lòng thử lại.");
        }
      } else {
        ToastError("Hình ảnh phải có định dạng jpg, png hoặc gif");
      }
    };
  };

  // Thêm handler cho toolbar của React Quill
  useEffect(() => {
    const quill = (document.querySelector(".ql-editor") as any)?.quill;
    if (quill) {
      const toolbar = quill.getModule("toolbar");
      toolbar.addHandler("image", handleImageUpload);
    }
  }, []);

  const onSubmit: SubmitHandler<AddProductForm> = async (data) => {
    try {
      if (isSubmitting) return;
      setIsSubmitting(true);

      // Kiểm tra bắt buộc ảnh sản phẩm, album, và ảnh biến thể
      if (!imageFile) {
        ToastError("Hình ảnh sản phẩm là bắt buộc");
        setIsSubmitting(false);
        return;
      }

      if (albumFiles.length === 0) {
        ToastError("Album ảnh sản phẩm là bắt buộc và phải có ít nhất một hình ảnh");
        setIsSubmitting(false);
        return;
      }

      const variantImageErrors = data.variants
        .map((variant, index) => {
          if (!variantImages[index] && !variant.image) {
            return `Hình ảnh cho biến thể ${index + 1} là bắt buộc`;
          }
          return null;
        })
        .filter(Boolean);

      if (variantImageErrors.length > 0) {
        variantImageErrors.forEach((err) => ToastError(err));
        setIsSubmitting(false);
        return;
      }

      let imageUrl = "";
      if (imageFile) imageUrl = await uploadToCloudinary(imageFile);

      const albumUrls = await Promise.all(albumFiles.map((file) => uploadToCloudinary(file)));

      const variantPromises = data.variants.map(async (variant, index) => {
        let variantImage = variant.image;
        if (variantImages[index] instanceof File) variantImage = await uploadToCloudinary(variantImages[index]);
        return { ...variant, image: variantImage }; // import_price đã có trong variant
      });
      const updatedVariants = await Promise.all(variantPromises);

      const payload = {
        name: data.name,
        category_id: data.category_id,
        description: data.description,
        status: data.status,
        sku: data.sku,
        images: imageUrl,
        album: albumUrls,
        variants: updatedVariants,
      };

      await postProduct(payload);
      ToastSucess("Thêm sản phẩm thành công!");
      navigate("/admin/product");
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error);
      if (error instanceof Error) {
        ToastError("Không thể tải dữ liệu sản phẩm: " + error.message);
      } else {
        ToastError("Không thể tải dữ liệu sản phẩm: Lỗi không xác định");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddVariant = () => {
    append({ price: 0, quantity: 0, import_price: 0, attributes: [{ attribute_id: "", value_id: "" }] }); // Thêm default import_price
    setVariantImages([...variantImages, null]);
    setFormattedPrices([...formattedPrices, ""]);
    setFormattedImportPrices([...formattedImportPrices, ""]); // Thêm cho import_price
  };

  const handleRemoveVariant = (index: number) => {
    remove(index);
    setVariantImages(variantImages.filter((_, i) => i !== index));
    setFormattedPrices(formattedPrices.filter((_, i) => i !== index));
    setFormattedImportPrices(formattedImportPrices.filter((_, i) => i !== index)); // Xóa cho import_price
  };

  const handleAddAttribute = (variantIndex: number) => {
    const currentAttributes = getValues(`variants.${variantIndex}.attributes`) || [];
    setValue(`variants.${variantIndex}.attributes`, [...currentAttributes, { attribute_id: "", value_id: "" }]);
    trigger(`variants.${variantIndex}.attributes`);
  };

  const handleRemoveAttribute = (variantIndex: number, attrIndex: number) => {
    const currentAttributes = getValues(`variants.${variantIndex}.attributes`) || [];
    currentAttributes.splice(attrIndex, 1);
    setValue(`variants.${variantIndex}.attributes`, currentAttributes);
    trigger(`variants.${variantIndex}.attributes`);
  };

  const handleAttributeChange = (variantIndex: number, attrIndex: number, field: string, value: string) => {
    const currentAttributes = getValues(`variants.${variantIndex}.attributes`) || [];
    currentAttributes[attrIndex] = { ...currentAttributes[attrIndex], [field]: value };
    setValue(`variants.${variantIndex}.attributes`, currentAttributes);
    trigger(`variants.${variantIndex}.attributes`);
  };

  const watchedAttributes = watch("variants");

  if (loading) return <div className="p-6 text-center text-gray-500">Đang tải dữ liệu...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h4 className="text-2xl font-semibold text-gray-800">Thêm sản phẩm mới</h4>
        <button
          type="button"
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          onClick={() => navigate("/admin/product")}
        >
          Quay lại
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white shadow-md rounded-lg mb-6">
            <div className="p-4 border-b">
              <h5 className="text-lg font-medium text-gray-800">Thông tin sản phẩm</h5>
            </div>
            <div className="p-4">
              <div className="mb-4">
                <label htmlFor="ecommerce-product-name" className="block text-sm font-medium text-gray-700 mb-1">
                  Tên sản phẩm
                </label>
                <input
                  {...register("name")}
                  type="text"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? "border-red-500" : "border-gray-300"}`}
                  id="ecommerce-product-name"
                  placeholder="Tên sản phẩm"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
              </div>
              <div className="mb-4">
                <label htmlFor="ecommerce-product-sku" className="block text-sm font-medium text-gray-700 mb-1">
                  SKU
                </label>
                <input
                  {...register("sku")}
                  type="text"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.sku ? "border-red-500" : "border-gray-300"}`}
                  id="ecommerce-product-sku"
                  placeholder="SKU"
                />
                {errors.sku && <p className="text-red-500 text-sm mt-1">{errors.sku.message}</p>}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả (Tùy chọn)</label>
                <ReactQuill
                  value={watch("description") || ""}
                  onChange={(value) => setValue("description", value)}
                  className={errors.description ? "border-red-500" : ""}
                  placeholder="Mô tả sản phẩm"
                  modules={quillModules}
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
              </div>
            </div>
          </div>

          <div className="bg-white shadow-md rounded-lg mb-6">
            <div className="p-4 border-b">
              <h5 className="text-lg font-medium text-gray-800">Biến thể</h5>
            </div>
            <div className="p-4">
              {fields.map((field, index) => (
                <div key={field.id} className="border border-gray-200 p-4 mb-4 rounded-lg">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4"> {/* Thay cols-2 thành cols-3 để thêm import_price */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Giá (VND)</label>
                      <input
                        type="text"
                        value={formattedPrices[index] || ""}
                        onChange={(e) => handlePriceChange(index, e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.variants?.[index]?.price ? "border-red-500" : "border-gray-300"}`}
                        placeholder="Giá (ví dụ: 1,000,000)"
                      />
                      <input
                        type="hidden"
                        {...register(`variants.${index}.price`)}
                      />
                      {errors.variants?.[index]?.price && (
                        <p className="text-red-500 text-sm mt-1">{errors.variants[index].price.message}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Giá nhập (VND)</label> {/* Thêm input cho import_price */}
                      <input
                        type="text"
                        value={formattedImportPrices[index] || ""}
                        onChange={(e) => handleImportPriceChange(index, e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.variants?.[index]?.import_price ? "border-red-500" : "border-gray-300"}`}
                        placeholder="Giá nhập (ví dụ: 500,000)"
                      />
                      <input
                        type="hidden"
                        {...register(`variants.${index}.import_price`)}
                      />
                      {errors.variants?.[index]?.import_price && (
                        <p className="text-red-500 text-sm mt-1">{errors.variants[index].import_price.message}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Số lượng</label>
                      <input
                        {...register(`variants.${index}.quantity`)}
                        type="number"
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.variants?.[index]?.quantity ? "border-red-500" : "border-gray-300"}`}
                        placeholder="Số lượng"
                      />
                      {errors.variants?.[index]?.quantity && (
                        <p className="text-red-500 text-sm mt-1">{errors.variants[index].quantity.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hình ảnh</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        if (file && !["image/jpeg", "image/png", "image/gif"].includes(file.type)) {
                          ToastError("Hình ảnh phải có định dạng jpg, png hoặc gif");
                          return;
                        }
                        setVariantImages((prev) => {
                          const newImages = [...prev];
                          newImages[index] = file;
                          return newImages;
                        });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                    />
                    {(variantImages[index] || getValues(`variants.${index}.image`)) && (
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <img
                          src={
                            variantImages[index]
                              ? URL.createObjectURL(variantImages[index])
                              : typeof getValues(`variants.${index}.image`) === "string"
                              ? getValues(`variants.${index}.image`)
                              : ""
                          }
                          className="h-20 object-cover border rounded-lg"
                        />
                      </div>
                    )}
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Thuộc tính</label>
                    {(getValues(`variants.${index}.attributes`) || []).map((attr: any, attrIndex: number) => (
                      <div key={attrIndex} className="flex items-center gap-2 mb-2">
                        <select
                          value={attr.attribute_id || ""}
                          onChange={(e) => handleAttributeChange(index, attrIndex, "attribute_id", e.target.value)}
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.variants?.[index]?.attributes?.[attrIndex]?.attribute_id ? "border-red-500" : "border-gray-300"}`}
                        >
                          <option value="">-- Chọn thuộc tính --</option>
                          {attributes?.map((att: any) => (
                            <option key={att._id} value={att._id}>
                              {att.name}
                            </option>
                          ))}
                        </select>
                        {errors.variants?.[index]?.attributes?.[attrIndex]?.attribute_id && (
                          <p className="text-red-500 text-sm mt-1">{errors.variants[index].attributes[attrIndex].attribute_id.message}</p>
                        )}
                        <select
                          value={attr.value_id || ""}
                          onChange={(e) => handleAttributeChange(index, attrIndex, "value_id", e.target.value)}
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.variants?.[index]?.attributes?.[attrIndex]?.value_id ? "border-red-500" : "border-gray-300"}`}
                        >
                          <option value="">-- Chọn giá trị --</option>
                          {attributeValues
                            ?.filter((val: any) => val?.attribute_id === watchedAttributes[index]?.attributes[attrIndex]?.attribute_id)
                            .map((val: any) => (
                              <option key={val._id} value={val._id}>
                                {val.value}
                              </option>
                            ))}
                        </select>
                        {errors.variants?.[index]?.attributes?.[attrIndex]?.value_id && (
                          <p className="text-red-500 text-sm mt-1">{errors.variants[index].attributes[attrIndex].value_id.message}</p>
                        )}
                        {attrIndex > 0 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveAttribute(index, attrIndex)}
                            className="text-red-500 hover:text-red-700 font-medium"
                          >
                            Xóa
                          </button>
                        )}
                      </div>
                    ))}
                    {errors.variants?.[index]?.attributes?.message && (
                      <p className="text-red-500 text-sm mt-1">{errors.variants[index].attributes.message}</p>
                    )}
                    <button
                      type="button"
                      onClick={() => handleAddAttribute(index)}
                      className="mt-2 px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      Thêm thuộc tính
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveVariant(index)}
                    className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Xóa biến thể
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddVariant}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Thêm biến thể
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white shadow-md rounded-lg mb-6">
            <div className="p-4 border-b">
              <h5 className="text-lg font-medium text-gray-800">Sắp xếp</h5>
            </div>
            <div className="p-4">
              <div className="mb-4">
                <label htmlFor="category-org" className="block text-sm font-medium text-gray-700 mb-1">
                  Danh mục
                </label>
                <select
                  {...register("category_id")}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.category_id ? "border-red-500" : "border-gray-300"}`}
                  id="category-org"
                >
                  <option value="">-- Chọn danh mục --</option>
                  {categories?.map((cat: any) => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
                {errors.category_id && <p className="text-red-500 text-sm mt-1">{errors.category_id.message}</p>}
              </div>
              <div className="mb-4">
                <label htmlFor="status-org" className="block text-sm font-medium text-gray-700 mb-1">
                  Trạng thái
                </label>
                <select
                  {...register("status")}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.status ? "border-red-500" : "border-gray-300"}`}
                  id="status-org"
                >
                  <option value="active">Đang bán</option>
                  <option value="disabled">Tạm tắt</option>
                  <option value="new">Mới</option>
                  <option value="bestseller">Bán chạy</option>
                </select>
                {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Hình ảnh sản phẩm</label>
                <div
                  {...getImageRootProps()}
                  className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer hover:border-blue-500"
                >
                  <input {...getImageInputProps()} />
                  <p className="text-gray-500">Kéo và thả hình ảnh hoặc nhấn để chọn (jpg, png, gif)</p>
                </div>
                {imageFile && (
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="relative">
                      <img src={URL.createObjectURL(imageFile)} className="h-20 object-cover border rounded-lg" />
                      <button
                        onClick={() => setImageFile(null)}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                      >
                        X
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Album ảnh</label>
                <div
                  {...getAlbumRootProps()}
                  className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer hover:border-blue-500"
                >
                  <input {...getAlbumInputProps()} />
                  <p className="text-gray-500">Kéo và thả nhiều hình ảnh hoặc nhấn để chọn (jpg, png, gif)</p>
                </div>
                {albumFiles.length > 0 && (
                  <div className="mt-2">
                    <ImageGallery
                      items={albumFiles.map((file) => ({
                        original: URL.createObjectURL(file),
                        thumbnail: URL.createObjectURL(file),
                      }))}
                      showPlayButton={false}
                      showFullscreenButton={true}
                      showThumbnails={true}
                      thumbnailPosition="bottom"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-start gap-4 pt-4">
        <button
          type="submit"
          onClick={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-blue-300"
        >
          Thêm sản phẩm
        </button>
      </div>
    </div>
  );
};

export default AddProduct;