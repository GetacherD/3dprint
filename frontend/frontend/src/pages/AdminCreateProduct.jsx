import {
  Container,
  Title,
  TextInput,
  NumberInput,
  Textarea,
  Button,
  Paper,
  FileInput,
  Image,
  Stack,
  Group,
  Text,
  Select,
  ActionIcon,
  Progress,
} from "@mantine/core";
import {
  IconTrash,
  IconRefresh,
} from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { useState, useEffect } from "react";
import api from "../api/axios";

export default function AdminCreateProduct() {
  const [images, setImages] = useState([]);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [stockQuantity, setStockQuantity] = useState("");

  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState(null);

  useEffect(() => {
    api.get("/api/categories").then((res) => {
      setCategories(
        res.data.map((c) => ({
          value: String(c.id),
          label: c.name,
        }))
      );
    });
  }, []);

  const handleAddImages = (files) => {
    if (!files) return;

    const arr = Array.isArray(files) ? files : [files];

    const newImages = arr.map((file) => ({
      id: URL.createObjectURL(file),
      file,
      url: URL.createObjectURL(file),
      progress: 0,
      error: false,
    }));

    setImages((prev) => [...prev, ...newImages]);
  };

  const handleDeleteImage = (id) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const retryUpload = (id) => {
    setImages((prev) =>
      prev.map((img) =>
        img.id === id ? { ...img, progress: 0, error: false } : img
      )
    );
  };

  const uploadSingle = async (img) => {
    const formData = new FormData();
    formData.append("file", img.file);

    try {
      const res = await api.post("/api/admin/products/upload", formData, {
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
      });

      setImages((prev) =>
        prev.map((i) =>
          i.id === img.id ? { ...i, progress: 100 } : i
        )
      );

      return res.data.data;
    } catch {
      setImages((prev) =>
        prev.map((i) =>
          i.id === img.id ? { ...i, error: true } : i
        )
      );
      throw new Error("upload failed");
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setIsUploading(true);

      if (!categoryId) {
        notifications.show({
          title: "Validation",
          message: "Please select a category",
          color: "yellow",
        });
        return;
      }

      const uploadPromises = images.map((img) => {
        if (img.error) {
          throw new Error("Fix failed uploads first");
        }
        return uploadSingle(img);
      });

      const uploadedUrls = await Promise.all(uploadPromises);

      await api.post("/api/admin/products", {
        name,
        description,
        price,
        stockQuantity,
        imageUrl: uploadedUrls[0],
        imageUrls: uploadedUrls,
        categoryId: Number(categoryId),
      });

      notifications.show({
        title: "Success",
        message: "Product created successfully",
        color: "green",
      });

      // reset
      setName("");
      setPrice("");
      setDescription("");
      setStockQuantity("");
      setImages([]);
      setCategoryId(null);

    } catch (err) {
      notifications.show({
        title: "Error",
        message: err.message || "Failed to create product",
        color: "red",
      });
    } finally {
      setLoading(false);
      setIsUploading(false);
    }
  };

  return (
    <Container size={500} my={40}>
      <Title order={2} mb="md">
        Create New Product
      </Title>

      <Paper shadow="xl" radius="lg" p="lg" withBorder>
        <Stack gap="lg">

          <Paper withBorder p="md" radius="md">
            <Stack>
              <Text fw={600}>Product Information</Text>

              <TextInput
                label="Product Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <Select
                label="Category"
                data={categories}
                value={categoryId}
                onChange={setCategoryId}
                required
              />

              <Group grow>
                <NumberInput
                  label="Price (QAR)"
                  value={price}
                  onChange={setPrice}
                  min={0}
                  required
                />

                <NumberInput
                  label="Stock Quantity"
                  value={stockQuantity}
                  onChange={setStockQuantity}
                  min={0}
                  required
                />
              </Group>

              <Textarea
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Stack>
          </Paper>

          <Paper withBorder p="md" radius="md">
            <Stack>
              <Text fw={600}>Product Images</Text>

              <FileInput
                multiple
                accept="image/*"
                onChange={handleAddImages}
              />

              {images.length > 0 && (
                <Group>
                  {images.map((img) => (
                    <div key={img.id} style={{ position: "relative" }}>
                      <Image src={img.url} width={80} height={80} />

                      <ActionIcon
                        color="red"
                        size="sm"
                        style={{ position: "absolute", top: 2, right: 2 }}
                        onClick={() => handleDeleteImage(img.id)}
                      >
                        <IconTrash size={14} />
                      </ActionIcon>

                      {img.error ? (
                        <ActionIcon
                          color="yellow"
                          size="sm"
                          style={{ position: "absolute", bottom: 2, right: 2 }}
                          onClick={() => retryUpload(img.id)}
                        >
                          <IconRefresh size={14} />
                        </ActionIcon>
                      ) : (
                        img.progress > 0 && (
                          <Progress value={img.progress} size="xs" mt={4} />
                        )
                      )}
                    </div>
                  ))}
                </Group>
              )}

            </Stack>
          </Paper>

          <Button
            loading={loading}
            disabled={isUploading}
            onClick={handleSubmit}
          >
            {isUploading ? "Uploading..." : "Create Product"}
          </Button>

        </Stack>
      </Paper>
    </Container>
  );
}