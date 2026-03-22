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
} from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { useEffect, useState } from "react";
import api from "../api/axios";

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

  const fetchProducts = () => {
    setLoading(true);
    api.get("/api/products?page=0&size=50").then((res) => {
      setProducts(res.data.data.content);
      setLoading(false);
    });
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
      <Title mb="lg">Admin Dashboard</Title>

      <Paper withBorder p="md">
        {loading ? (
          <Center><Loader /></Center>
        ) : (
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Image</Table.Th>
                <Table.Th>Name</Table.Th>
                <Table.Th>Price</Table.Th>
                <Table.Th>Stock</Table.Th>
                <Table.Th>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>

            <Table.Tbody>
              {products.map((p) => (
                <Table.Tr key={p.id}>
                  <Table.Td>
                    <Image
                      src={`http://localhost:8080${p.imageUrl}`}
                      width={60}
                      height={60}
                    />
                  </Table.Td>

                  <Table.Td>{p.name}</Table.Td>
                  <Table.Td>{p.price}</Table.Td>
                  <Table.Td>{p.stockQuantity}</Table.Td>

                  <Table.Td>
                    <Group>
                      <Button size="xs" onClick={() => openEdit(p)}>
                        Edit
                      </Button>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
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
                  src={`http://localhost:8080${img}`}
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