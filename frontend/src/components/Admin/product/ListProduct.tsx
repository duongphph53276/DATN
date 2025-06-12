import { useEffect, useState } from "react";
import { deleteProduct, getAllProducts } from "../../../api/product.api";
import { IProduct } from "../../../interface";
import { useNavigate } from "react-router-dom";

const ProductList = () => {
    const [products, setProducts] = useState<IProduct[]>([]);
    const navigate = useNavigate();
    const fetchProducts = async () => {
        try {
            const res = await getAllProducts();
            setProducts(res.data.data); // đảm bảo API backend trả về { data: [...] }
        } catch (err) {
            console.error("Lỗi khi lấy sản phẩm:", err);
        }
    };
    useEffect(() => {


        fetchProducts();
    }, []);
    const handleDelete = async (id: string | number) => {
        const confirm = window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?");
        if (!confirm) return;

        try {
            await deleteProduct(id);
            // Sau khi xóa, load lại danh sách
            fetchProducts();
        } catch (error) {
            alert("Xóa sản phẩm thất bại");
            console.error(error);
        }
    };
    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">📚 Danh sách sản phẩm</h1>
                <button
                    onClick={() => navigate('/admin/product/add')}
                    className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition"
                >
                    + Thêm sản phẩm
                </button>
            </div>
            <table className="w-full table-auto border border-collapse border-gray-300">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border px-4 py-2">Tên</th>
                        <th className="border px-4 py-2">Ảnh</th>
                        <th className="border px-4 py-2">Trạng thái</th>
                        <th className="border px-4 py-2">SKU</th>
                        <th className="border px-4 py-2">Đã bán</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product._id} className="text-center">
                            <td className="border px-4 py-2">{product.name}</td>
                            <td className="border px-4 py-2">
                                {product.images ? (
                                    <img src={product.images} alt={product.name} className="w-20 h-20 object-cover mx-auto" />
                                ) : (
                                    <span>Không có ảnh</span>
                                )}
                            </td>
                            <td className="border px-4 py-2">{product.status}</td>
                            <td className="border px-4 py-2">{product.sku}</td>
                            <td className="border px-4 py-2">{product.sold_quantity ?? 0}</td>
                            <td className="border p-2">
                                <button
                                    onClick={() => navigate(`/admin/product/edit/${product._id}`)}
                                    className="text-sm text-blue-600 hover:underline"
                                >
                                    Sửa
                                </button>
                            </td>
                            <td className="border p-2">
                                <button
                                    onClick={() => handleDelete(product._id!)}
                                    className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
                                >
                                    Xóa
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProductList;
