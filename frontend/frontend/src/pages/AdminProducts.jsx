import {
  Container,
  Title,
  Table,
  Button,
  Group,
  Image,
  Paper,
  Loader,
  Center,
  Modal,
  TextInput,
  NumberInput,
  Textarea,
  Stack,
  FileInput,
  ActionIcon,
  SimpleGrid,
  Text,
} from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { useEffect, useState } from "react";
import api from "../api/axios";
import { getImageUrl } from "../utils/image";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [opened, setOpened] = useState(false);
  const [selected, setSelected] = useState(null);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [stockQuantity, setStockQuantity] = useState("");

  const [imageFiles, setImageFiles] = useState([]);
  const [preview, setPreview] = useState([]);

  const [heroTitle, setHeroTitle] = useState("");
const [heroDesc, setHeroDesc] = useState("");

  const fetchProducts = () => {
    setLoading(true);
    api.get("/api/products?page=0&size=50").then((res) => {
      setProducts(res.data.data.content);
      setLoading(false);
    });
    api.get("/api/content/hero_title")
    .then(res => setHeroTitle(res.data.data));

  api.get("/api/content/hero_description")
    .then(res => setHeroDesc(res.data.data));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openEdit = (product) => {
    setSelected(product);
    setName(product.name);
    setPrice(product.price);
    setDescription(product.description);
    setStockQuantity(product.stockQuantity);

    setImageFiles([]);
    setPreview([]);

    setOpened(true);
  };

  const handleDeleteImage = async (imgUrl) => {
    try {
      await api.delete(
        `/api/admin/products/${selected.id}/image?imageUrl=${encodeURIComponent(imgUrl)}`
      );

      notifications.show({
        title: "Deleted",
        message: "Image removed",
        color: "green",
      });

      // 🔥 update UI instantly
      setSelected((prev) => ({
        ...prev,
        imageUrls: prev.imageUrls.filter((i) => i !== imgUrl),
      }));

    } catch {
      notifications.show({
        title: "Error",
        message: "Failed to delete image",
        color: "red",
      });
    }
  };

  const handleUpdate = async () => {
    try {
      let uploadedUrls = [];

      if (imageFiles.length > 0) {
        for (let file of imageFiles) {
          const formData = new FormData();
          formData.append("file", file);

          const res = await api.post("/api/admin/products/upload", formData);
          uploadedUrls.push(res.data.data);
        }
      }

      await api.put(`/api/admin/products/${selected.id}`, {
        name,
        description,
        price,
        stockQuantity,
        imageUrl:
          uploadedUrls.length > 0
            ? uploadedUrls[0]
            : selected.imageUrl,
        imageUrls:
          uploadedUrls.length > 0
            ? [...(selected.imageUrls || []), ...uploadedUrls]
            : selected.imageUrls,
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

  return (
    <Container size="lg">
      <Title order={2} mb="lg">
  Product Management
</Title>
<Paper withBorder p="md" mb="lg" radius="md">
  <Stack>
    <Text fw={600} mb="xs">
  Homepage Hero Content
</Text>

    <Textarea
      label="Hero Title"
      value={heroTitle}
      onChange={(e) => setHeroTitle(e.target.value)}
    />

    <Textarea
      label="Hero Description"
      value={heroDesc}
      onChange={(e) => setHeroDesc(e.target.value)}
    />

    <Button
      onClick={async () => {
        try {
          await api.put(
  "/api/content/hero_title",
  { value: heroTitle },
  {
    headers: {
      "Content-Type": "application/json",
    },
  }
);

await api.put(
  "/api/content/hero_description",
  { value: heroDesc },
  {
    headers: {
      "Content-Type": "application/json",
    },
  }
);

          notifications.show({
            title: "Saved",
            message: "Homepage content updated",
            color: "green",
          });
        } catch {
          notifications.show({
            title: "Error",
            message: "Failed to update content",
            color: "red",
          });
        }
      }}
    >
      Save Content
    </Button>
  </Stack>
</Paper>

      <Paper withBorder p="md">
        {loading ? (
          <Center><Loader /></Center>
        ) : (
          <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }}>
  {products.map((p) => (
    <Paper
      key={p.id}
      withBorder
      radius="lg"
      p="sm"
      style={{
        transition: "0.2s",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow =
          "0 8px 20px rgba(0,0,0,0.08)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "none";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* IMAGE */}
      <Image
        src={getImageUrl(p.imageUrl)}
        height={160}
        radius="md"
        fit="cover"
      />

      {/* INFO */}
      <Stack mt="sm" gap={4}>
        <Text fw={600} lineClamp={1}>
          {p.name}
        </Text>

        <Text size="sm" c="dimmed">
          {p.price} QAR
        </Text>

        <Text size="xs">
          Stock: {p.stockQuantity}
        </Text>
      </Stack>

      {/* ACTION */}
      <Group mt="sm">
        <Button
          size="xs"
          fullWidth
          onClick={() => openEdit(p)}
        >
          Edit
        </Button>
      </Group>
    </Paper>
  ))}
</SimpleGrid>
        )}
      </Paper>

      {/* 🔥 EDIT MODAL */}
      <Modal opened={opened} onClose={() => setOpened(false)} title="Edit Product">
        <Stack>

          {/* 🔥 EXISTING IMAGES */}
          <Group>
            {selected?.imageUrls?.map((img, i) => (
              <div key={i} style={{ position: "relative" }}>
                <Image
                  src={`${img}`}
                  width={80}
                  height={80}
                />
                <ActionIcon
                  color="red"
                  size="sm"
                  style={{ position: "absolute", top: 0, right: 0 }}
                  onClick={() => handleDeleteImage(img)}
                >
                  <IconTrash size={14} />
                </ActionIcon>
              </div>
            ))}
          </Group>

          <FileInput
            multiple
            onChange={(files) => {
              const arr = Array.isArray(files) ? files : [files];
              setImageFiles(arr);
              setPreview(arr.map((f) => URL.createObjectURL(f)));
            }}
          />

          {/* 🔥 NEW PREVIEW */}
          <Group>
            {preview.map((p, i) => (
              <Image key={i} src={p} width={80} height={80} />
            ))}
          </Group>

          <Button onClick={handleUpdate}>Update</Button>

        </Stack>
      </Modal>
    </Container>
  );
}
