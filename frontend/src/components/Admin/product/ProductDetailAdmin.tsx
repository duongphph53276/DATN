import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProductById } from "../../../api/product.api";
import { getVariantsByProduct } from "../../../api/variant.api";
import { IProduct } from "../../../interfaces/product";
import { IVariant, IVariantAttribute } from "../../../interfaces/variant";

const ProductDetailAdmin = () => {
    const { id } = useParams();
    const [product, setProduct] = useState<IProduct | null>(null);
    const [variants, setVariants] = useState<IVariant[]>([]);

    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
            try {
                const res = await getProductById(id);
                const variantRes = await getVariantsByProduct(id);

                setProduct(res.data.data.product);
                setVariants(variantRes.data.data);
            } catch (err) {
                alert("Không tìm thấy sản phẩm");
            }
        };

        fetchData();
    }, [id]);


    if (!product) return <div>Loading...</div>;

    return (
        <div className="p-4">
            <div className="text-2xl font-bold mb-4">Chi tiết sản phẩm</div>
            <div className="bg-white p-4 rounded shadow">
                <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
                <p>Danh mục: {typeof product.category_id === 'object' ? product.category_id.name : product.category_id}</p>
                <p>Trạng thái: {product.status}</p>
                <p>Mô tả: {product.description}</p>
                <p>SKU: {product.sku}</p>
                <p>Đánh giá trung bình: {product.average_rating}</p>
                <p>Số lượng đã bán: {product.sold_quantity}</p>
                <div className="flex gap-2 mt-2">
                    {product.album?.map((img, idx) => (
                        <img key={idx} src={img} alt="album" className="w-20 h-20 object-cover rounded" />
                    ))}
                </div>
            </div>

            <div className="flex justify-between items-center mt-6">
                <h3 className="text-xl font-semibold">Danh sách biến thể</h3>
                <Link
                    to={`/admin/product/${id}/add-variant`}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    + Thêm biến thể
                </Link>
            </div>

            <table className="table-auto w-full mt-3 text-left">
                <thead>
                    <tr>
                        <th className="border px-2 py-1">Ảnh</th>
                        <th className="border px-2 py-1">Giá</th>
                        <th className="border px-2 py-1">Số lượng</th>
                        <th className="border px-2 py-1">Thuộc tính</th>
                    </tr>
                </thead>
                <tbody>
                    {variants.map((variant) => (
                        <tr key={variant._id}>
                            <td className="border px-2 py-1">
                                {variant.image && <img src={variant.image} className="w-16 h-16 object-cover" />}
                            </td>
                            <td className="border px-2 py-1">{variant.price.toLocaleString()}đ</td>
                            <td className="border px-2 py-1">{variant.quantity}</td>
                            <td className="border px-2 py-1">
                                {variant.attributes.map((attr: IVariantAttribute, idx: number) => (
                                    <div key={idx}>{attr.attribute_name || attr.attribute_id}: {attr.value || attr.value_id}</div>
                                ))}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ProductDetailAdmin;
