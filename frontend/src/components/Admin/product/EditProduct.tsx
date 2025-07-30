import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { getProductById, updateProduct } from "../../../../api/product.api";
import { getCategories } from "../../../../api/category.api";
import { uploadToCloudinary } from "../../../lib/cloudinary";
import { getAllAttributes, getAttributeValues } from "../../../../api/attribute.api";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

type EditProductForm = {
  name: string;
  category_id: string;
  description?: string;
  status?: "active" | "disabled" | "new" | "bestseller";
  sku?: string;
  average_rating?: number;
  sold_quantity?: number;
  variants: {
    _id?: string;
    price: number;
    quantity: number;
    image?: File | string;
    attributes: { attribute_id: string; value_id: string }[];
  }[];
};

const validationSchema = yup.object().shape({
  name: yup
    .string()
    .required("Tên sản phẩm là bắt buộc")
    .min(2, "Tên sản phẩm phải từ 2 đến 100 ký tự")
    .max(100, "Tên sản phẩm phải từ 2 đến 100 ký tự"),
  category_id: yup.string().required("Bắt buộc chọn danh mục"),
  description: yup.string().optional(),
  sku: yup.string().nullable().transform((value) => (value?.trim() === "" ? null : value)),
  average_rating: yup.number().optional(),
  sold_quantity: yup.number().optional(),
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
              .filter((_: any, idx: number) => idx !== context.options.index)
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
          (attributes, context) => {
            const currentKey = attributes
              ?.map((attr) => `${attr.attribute_id}-${attr.value_id}`)
              .sort()
              .join("|") || "";
            const allVariants = context.from?.[1]?.value?.variants || [];
            const currentVariant = allVariants[context.options.index] || {};
            const otherVariants = allVariants.filter((_: any, idx: any) => idx !== context.options.index);
            const existingKeys = otherVariants.map((v: any) =>
              v.attributes
                .map((attr: any) => `${attr.attribute_id}-${attr.value_id}`)
                .sort()
                .join("|")
            );
            return !existingKeys.includes(currentKey) || (currentVariant._id && currentKey === existingKeys.find((key: string) => key === currentKey));
          }
        ),
    })
  ).min(1, "Phải có ít nhất một biến thể"),
});

const EditProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [categories, setCategories] = useState<any[]>([]);
  const [attributes, setAttributes] = useState<any[]>([]);
  const [attributeValues, setAttributeValues] = useState<any[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [albumFiles, setAlbumFiles] = useState<File[]>([]);
  const [variantImages, setVariantImages] = useState<(File | null)[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formattedPrices, setFormattedPrices] = useState<string[]>([]);
  const [productData, setProductData] = useState<any>(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    watch,
    trigger,
    formState: { errors },
  } = useForm<EditProductForm>({
    resolver: yupResolver(validationSchema),
    mode: "onChange",
    defaultValues: {
      variants: [{ price: undefined, quantity: 0, attributes: [{ attribute_id: "", value_id: "" }] }],
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
        console.log("Fetching data with ID:", id);
        const [catRes, attrRes] = await Promise.all([getCategories(), getAllAttributes()]);
        setCategories(catRes.data?.data || []);
        setAttributes(attrRes.data?.data || []);
        const attrIds = attrRes.data?.data?.map((attr: any) => attr._id) || [];
        const valuesPromises = attrIds.map((id: string) => getAttributeValues(id));
        const valuesRes = await Promise.all(valuesPromises);
        const allValues = valuesRes.flatMap((res) => res.data?.data || []);
        setAttributeValues(allValues);

        if (id) {
          const res = await getProductById(id);
          console.log("API Response:", res);
          console.log("Variants from API:", res.data.data.variants);
          if (!res.data || !res.data.data || !res.data.data.product) {
            throw new Error("Dữ liệu sản phẩm không hợp lệ từ API");
          }
          const product = res.data.data.product;
          console.log("Product data:", product);
          setProductData(product);
          setValue("name", product.name || "");
          setValue("category_id", product.category_id?._id || "");
          setValue("description", product.description || "");
          setValue("status", product.status || "active");
          setValue("sku", product.sku || "");
          const variants = res.data.data.variants || [];
          console.log("Processed variants:", variants);
          setValue("variants", variants.length > 0 ? variants.map((v: any) => ({
            _id: v._id,
            price: v.price || 0,
            quantity: v.quantity || 0,
            image: v.image || "",
            attributes: v.attributes?.map((a: any) => ({
              attribute_id: a.attribute_id?._id || a.attribute_id || "",
              value_id: a.value_id?._id || a.value_id || "",
            })) || [{ attribute_id: "", value_id: "" }],
          })) : [{ price: 0, quantity: 0, attributes: [{ attribute_id: "", value_id: "" }] }]);
          setFormattedPrices(variants.length > 0 ? variants.map((v: any) => (v.price || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")) : ["0"]);
          setVariantImages(variants.length > 0 ? variants.map((v: any) => null) : [null]);
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
        if (error instanceof Error) {
          alert("Không thể tải dữ liệu sản phẩm: " + error.message);
        } else {
          alert("Không thể tải dữ liệu sản phẩm: Lỗi không xác định");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, setValue]);

  const handlePriceChange = (index: number, value: string) => {
    console.log("Input value:", value);
    // Loại bỏ tất cả ký tự không phải số (ngoại trừ trường hợp ô trống)
    const sanitizedValue = value.replace(/[^0-9]/g, "");
    console.log("Sanitized value:", sanitizedValue);

    try {
      if (sanitizedValue === "") {
        setFormattedPrices((prev) => {
          const newPrices = [...prev];
          newPrices[index] = "";
          return newPrices;
        });
        setValue(`variants.${index}.price`, undefined, { shouldValidate: false });
        trigger(`variants.${index}.price`); // Kích hoạt validation
      } else {
        const numValue = parseInt(sanitizedValue, 10);
        console.log("Number value:", numValue);
        if (isNaN(numValue)) {
          setFormattedPrices((prev) => {
            const newPrices = [...prev];
            newPrices[index] = prev[index] || "";
            return newPrices;
          });
          trigger(`variants.${index}.price`); // Kích hoạt validation để hiển thị lỗi
          return;
        }
        // Định dạng số với dấu phẩy để hiển thị
        const formattedValue = numValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        setFormattedPrices((prev) => {
          const newPrices = [...prev];
          newPrices[index] = formattedValue;
          return newPrices;
        });
        // Cập nhật giá trị form dưới dạng số
        setValue(`variants.${index}.price`, numValue, { shouldValidate: true });
        trigger(`variants.${index}.price`); // Kích hoạt validation sau khi cập nhật
      }
    } catch (error) {
      console.error("Lỗi trong handlePriceChange:", error);
      // Ngăn lỗi làm crash component
    }
  };

  const onSubmit: SubmitHandler<EditProductForm> = async (data) => {
    try {
      if (isSubmitting || !id) return;
      setIsSubmitting(true);
      let imageUrl = productData.images || "";
      if (imageFile) imageUrl = await uploadToCloudinary(imageFile);
      const albumUrls = productData.album || [];
      if (albumFiles.length > 0) {
        const newAlbumUrls = await Promise.all(albumFiles.map((file) => uploadToCloudinary(file)));
        albumUrls.push(...newAlbumUrls);
      }
      const variantPromises = data.variants.map(async (variant, index) => {
        let variantImage = variant.image;
        if (variantImages[index] instanceof File) variantImage = await uploadToCloudinary(variantImages[index]);
        else if (typeof variant.image === "string") variantImage = variant.image;
        return { ...variant, image: variantImage };
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
      await updateProduct(id, payload);
      alert("Cập nhật sản phẩm thành công!");
      navigate("/admin/product");
    } catch (error) {
      console.error("Lỗi khi cập nhật sản phẩm:", error);
      if (error instanceof Error) {
        alert("Không thể tải dữ liệu sản phẩm: " + error.message);
      } else {
        alert("Không thể tải dữ liệu sản phẩm: Lỗi không xác định");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddVariant = () => {
    append({ price: 0, quantity: 0, attributes: [{ attribute_id: "", value_id: "" }] });
    setVariantImages([...variantImages, null]);
    setFormattedPrices([...formattedPrices, ""]);
  };

  const handleRemoveVariant = (index: number) => {
    remove(index);
    setVariantImages(variantImages.filter((_, i) => i !== index));
    setFormattedPrices(formattedPrices.filter((_, i) => i !== index));
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
        <h4 className="text-2xl font-semibold text-gray-800">Chỉnh sửa sản phẩm</h4>
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả (Tùy chọn)</label>
                <textarea
                  {...register("description")}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.description ? "border-red-500" : "border-gray-300"}`}
                  rows={5}
                  placeholder="Mô tả sản phẩm"
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Giá (VND)</label>
                      <input
                        type="text"
                        value={formattedPrices[index] || ""}
                        onChange={(e) => handlePriceChange(index, e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.variants?.[index]?.price ? "border-red-500" : "border-gray-300"}`}
                        placeholder="Giá"
                      />
                      {errors.variants?.[index]?.price && (
                        <p className="text-red-500 text-sm mt-1">{errors.variants[index].price.message}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Số lượng</label>
                      <input
                        {...register(`variants.${index}.quantity`, { valueAsNumber: true })}
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
                          alert("Hình ảnh phải có định dạng jpg, png hoặc gif");
                          return;
                        }
                        setVariantImages((prev) => {
                          const newImages = [...prev];
                          newImages[index] = file;
                          return newImages;
                        });
                        if (file !== null) {
                          setValue(`variants.${index}.image`, file);
                        }
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
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    if (file && !["image/jpeg", "image/png", "image/gif"].includes(file.type)) {
                      alert("Hình ảnh chính phải có định dạng jpg, png hoặc gif");
                      return;
                    }
                    setImageFile(file);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                />
                {productData?.images && (
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <img src={productData.images} className="h-20 object-cover border rounded-lg" />
                  </div>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Album ảnh</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    if (files.some((file) => !["image/jpeg", "image/png", "image/gif"].includes(file.type))) {
                      alert("Tất cả hình ảnh trong album phải có định dạng jpg, png hoặc gif");
                      return;
                    }
                    setAlbumFiles(files);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                />
                {productData?.album?.length > 0 && (
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {productData.album.map((url: string, i: number) => (
                      <img key={i} src={url} className="h-20 object-cover border rounded-lg" />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-start gap-4 pt-4">
        <button
          type="button"
          onClick={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-blue-300"
        >
          Cập nhật sản phẩm
        </button>
      </div>
    </div>
  );
};

export default EditProduct;