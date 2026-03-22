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
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useState } from "react";
import api from "../api/axios";

export default function AdminCreateProduct() {
  const [imageFile, setImageFile] = useState([]);
  const [preview, setPreview] = useState([]);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [stockQuantity, setStockQuantity] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);

      // 🔥 Upload all images
      const uploadedUrls = [];

      for (let file of imageFile) {
        const formData = new FormData();
        formData.append("file", file);

        const res = await api.post("/api/admin/products/upload", formData);
        uploadedUrls.push(res.data.data);
      }

      console.log("Uploaded URLs:", uploadedUrls);

      // 🔥 Create product
      await api.post("/api/admin/products", {
        name,
        description,
        price,
        stockQuantity,
        imageUrl: uploadedUrls[0], // fallback
        imageUrls: uploadedUrls,
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
        <Stack>
          <TextInput
            label="Product Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

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

          <Textarea
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          {/* 🔥 MULTIPLE FILE INPUT */}
          <FileInput
            label="Product Images"
            multiple
            accept="image/*"
            onChange={(files) => {
              if (!files) return;

              const fileArray = Array.isArray(files) ? files : [files];

              setImageFile(fileArray);
              setPreview(fileArray.map((f) => URL.createObjectURL(f)));
            }}
          />

          {/* 🔥 FIXED PREVIEW (MULTIPLE) */}
          {preview.length > 0 && (
            <Group>
              {preview.map((img, i) => (
                <Image
                  key={i}
                  src={img}
                  width={80}
                  height={80}
                  radius="md"
                />
              ))}
            </Group>
          )}

          <Button loading={loading} onClick={handleSubmit}>
            Create Product
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}