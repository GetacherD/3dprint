// ... everything unchanged above

const handleUpdate = async () => {
  try {
    const uploadPromises = images.map((img) => {
      if (img.type === "server") {
        return Promise.resolve(img.url);
      }

      const formData = new FormData();
      formData.append("file", img.file);

      return api
        .post("/api/admin/products/upload", formData, {
          onUploadProgress: (progressEvent) => {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );

            setImages((prev) =>
              prev.map((i) =>
                i.id === img.id ? { ...i, progress: percent } : i
              )
            );
          },
        })
        .then((res) => {
          // ensure 100% when done
          setImages((prev) =>
            prev.map((i) =>
              i.id === img.id ? { ...i, progress: 100 } : i
            )
          );

          return res.data.data;
        });
    });

    const uploadedUrls = await Promise.all(uploadPromises);

    await api.put(`/api/admin/products/${selected.id}`, {
      name: selected.name,
      description: selected.description,
      price: selected.price,
      stockQuantity: selected.stockQuantity,
      imageUrl: uploadedUrls[0],
      imageUrls: uploadedUrls,
      categoryId: categoryId ? Number(categoryId) : null,
    });

    notifications.show({
      title: "Updated",
      message: "Product updated",
      color: "green",
    });

    setOpened(false);
    fetchProducts();
  } catch {
    notifications.show({
      title: "Error",
      message: "Update failed",
      color: "red",
    });
  }
};