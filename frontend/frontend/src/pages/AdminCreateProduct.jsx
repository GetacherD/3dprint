import {
  Container,
  Title,
  Divider,
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

  const fieldStyles = {
    input: {
      borderRadius: "var(--radius-md)",
      borderColor: "var(--border)",
      background: "#fff",
    },
  };

  return (
    <Container size="md" my="md" px={0}>
      <Title order={2} mb={4} c="var(--text-primary)">
        Create New Product
      </Title>
      <Text size="sm" c="dimmed" mb="lg">
        Add product details, upload gallery images, and publish to catalog.
      </Text>

      <Paper
        shadow="xl"
        radius="var(--radius-lg)"
        p={{ base: "md", sm: "lg" }}
        withBorder
        style={{
          borderColor: "var(--border)",
          background: "var(--bg-card)",
          boxShadow: "var(--shadow-md)",
        }}
      >
        <Stack gap="lg">

          <Paper
            withBorder
            p="md"
            radius="var(--radius-md)"
            style={{ borderColor: "var(--border)", background: "#fff" }}
          >
            <Stack>
              <Text fw={700} c="var(--text-primary)">Product Information</Text>
              <Divider color="var(--border)" />

              <TextInput
                label="Product Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                styles={fieldStyles}
              />

              <Select
                label="Category"
                data={categories}
                value={categoryId}
                onChange={setCategoryId}
                required
                styles={fieldStyles}
              />

              <Group grow>
                <NumberInput
                  label="Price (QAR)"
                  value={price}
                  onChange={setPrice}
                  min={0}
                  required
                  styles={fieldStyles}
                />

                <NumberInput
                  label="Stock Quantity"
                  value={stockQuantity}
                  onChange={setStockQuantity}
                  min={0}
                  required
                  styles={fieldStyles}
                />
              </Group>

              <Textarea
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                minRows={3}
                autosize
                styles={fieldStyles}
              />
            </Stack>
          </Paper>

          <Paper
            withBorder
            p="md"
            radius="var(--radius-md)"
            style={{ borderColor: "var(--border)", background: "#fff" }}
          >
            <Stack>
              <Text fw={700} c="var(--text-primary)">Product Images</Text>
              <Divider color="var(--border)" />

              <FileInput
                label="Upload images"
                multiple
                accept="image/*"
                onChange={handleAddImages}
                clearable
                styles={fieldStyles}
              />

              {images.length > 0 && (
                <Group gap="sm" wrap="wrap">
                  {images.map((img) => (
                    <div
                      key={img.id}
                      style={{
                        position: "relative",
                        padding: 6,
                        borderRadius: 10,
                        border: "1px solid var(--border)",
                        background: "#fff",
                      }}
                    >
                      <Image src={img.url} width={84} height={84} radius="var(--radius-sm)" />

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
            radius="xl"
            size="md"
            fullWidth
            style={{
              background: "var(--primary)",
              color: "#fff",
              boxShadow: "var(--shadow-sm)",
              fontWeight: 700,
            }}
            onClick={handleSubmit}
          >
            {isUploading ? "Uploading..." : "Create Product"}
          </Button>

        </Stack>
      </Paper>
    </Container>
  );
}