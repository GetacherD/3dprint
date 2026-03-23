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
  ActionIcon, // 🔥 NEW
} from "@mantine/core";
import { IconTrash } from "@tabler/icons-react"; // 🔥 NEW
import { notifications } from "@mantine/notifications";
import { useState, useEffect } from "react";
import api from "../api/axios";

export default function AdminCreateProduct() {
  const [imageFile, setImageFile] = useState([]);
  const [preview, setPreview] = useState([]);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [stockQuantity, setStockQuantity] = useState("");
  const [loading, setLoading] = useState(false);

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

  // 🔥 DELETE IMAGE BEFORE SAVE
  const handleDeleteImage = (index) => {
    setImageFile((prev) => prev.filter((_, i) => i !== index));
    setPreview((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      if (!categoryId) {
        notifications.show({
          title: "Validation",
          message: "Please select a category",
          color: "yellow",
        });
        return;
      }

      const uploadedUrls = [];

      for (let file of imageFile) {
        const formData = new FormData();
        formData.append("file", file);

        const res = await api.post("/api/admin/products/upload", formData);
        uploadedUrls.push(res.data.data);
      }

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
      setImageFile([]);
      setPreview([]);
      setCategoryId(null);

    } catch (err) {
      console.error(err);

      notifications.show({
        title: "Error",
        message: "Failed to create product",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size={500} my={40}>
      <Title order={2} mb="md">
        Create New Product
      </Title>

      <Paper shadow="xl" radius="lg" p="lg" withBorder>
        <Stack gap="lg">

          {/* PRODUCT INFO */}
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
                placeholder="Select category"
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

          {/* IMAGE UPLOAD */}
          <Paper withBorder p="md" radius="md">
            <Stack>
              <Text fw={600}>Product Images</Text>

              <FileInput
                label="Upload Images"
                multiple
                accept="image/*"
                onChange={(files) => {
                  if (!files) return;

                  const fileArray = Array.isArray(files) ? files : [files];

                  setImageFile(fileArray);
                  setPreview(fileArray.map((f) => URL.createObjectURL(f)));
                }}
              />

              {/* 🔥 ENHANCED PREVIEW */}
              {preview.length > 0 && (
                <Group>
                  {preview.map((img, i) => (
                    <div key={i} style={{ position: "relative" }}>
                      <Image
                        src={img}
                        width={80}
                        height={80}
                        radius="md"
                      />

                      <ActionIcon
                        color="red"
                        size="sm"
                        style={{
                          position: "absolute",
                          top: 2,
                          right: 2,
                        }}
                        onClick={() => handleDeleteImage(i)}
                      >
                        <IconTrash size={14} />
                      </ActionIcon>
                    </div>
                  ))}
                </Group>
              )}

            </Stack>
          </Paper>

          <Button
            loading={loading}
            size="md"
            radius="md"
            onClick={handleSubmit}
          >
            Create Product
          </Button>

        </Stack>
      </Paper>
    </Container>
  );
}