export const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "fuzzy_bear"); // ✅ thay bằng preset bạn tạo
    formData.append("cloud_name", "dzfd80h0f");       // ✅ thay bằng cloud name của bạn

    const response = await fetch("https://api.cloudinary.com/v1_1/dzfd80h0f/image/upload", {
        method: "POST",
        body: formData,
    });

    const data = await response.json();
    console.log("Cloudinary response:", data);
    return data.secure_url; // đường link ảnh Cloudinary
};
