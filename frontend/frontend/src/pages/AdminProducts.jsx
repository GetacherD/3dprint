import {
  Container,
  Title,
  Button,
  Group,
  Image,
  Paper,
  Loader,
  Center,
  Modal,
  Stack,
  FileInput,
  ActionIcon,
  SimpleGrid,
  Text,
  Select,
  Badge,
  Progress,
  TextInput,
  Textarea,
  NumberInput,
} from "@mantine/core";
import {
  IconTrash,
  IconGripVertical,
  IconRefresh,
} from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { useEffect, useState } from "react";
import api from "../api/axios";
import { getImageUrl } from "../utils/image";

import {
  DndContext,
  closestCenter,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [opened, setOpened] = useState(false);
  const [selected, setSelected] = useState(null);

  const [images, setImages] = useState([]);
  const [categoryId, setCategoryId] = useState(null);

  const [isUploading, setIsUploading] = useState(false);

  const fetchProducts = () => {
    setLoading(true);
    api.get("/api/products?page=0&size=50").then((res) => {
      setProducts(res.data.data.content);
      setLoading(false);
    });
  };

  const fetchCategories = () => {
    api.get("/api/categories").then((res) => {
      setCategories(
        res.data.map((c) => ({
          value: String(c.id),
          label: c.name,
        }))
      );
    });
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const openEdit = (product) => {
    setSelected(product);
    setCategoryId(product.categoryId ? String(product.categoryId) : null);

    const serverImages =
      product.imageUrls?.map((url) => ({
        id: url,
        type: "server",
        url,
      })) || [];

    setImages(serverImages);
    setOpened(true);
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      await api.delete(`/api/admin/products/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id));

      notifications.show({
        title: "Deleted",
        message: "Product removed",
        color: "green",
      });
    } catch {
      notifications.show({
        title: "Error",
        message: "Delete failed",
        color: "red",
      });
    }
  };

  const handleAddImages = (files) => {
    const arr = Array.isArray(files) ? files : [files];

    const newImages = arr.map((file) => ({
      id: URL.createObjectURL(file),
      type: "local",
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

  function SortableItem({ item }) {
    const { attributes, listeners, setNodeRef, transform, transition } =
      useSortable({ id: item.id });

    return (
      <div
        ref={setNodeRef}
        style={{
          transform: CSS.Transform.toString(transform),
          transition,
          position: "relative",
        }}
      >
        <div
          {...attributes}
          {...listeners}
          style={{
            position: "absolute",
            top: 2,
            left: 2,
            cursor: "grab",
            zIndex: 3,
            background: "rgba(0,0,0,0.4)",
            borderRadius: 4,
            padding: 2,
          }}
        >
          <IconGripVertical size={14} color="white" />
        </div>

        <Image
          src={item.type === "server" ? getImageUrl(item.url) : item.url}
          width={90}
          height={90}
        />

        <ActionIcon
          color="red"
          size="sm"
          style={{ position: "absolute", top: 2, right: 2 }}
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteImage(item.id);
          }}
        >
          <IconTrash size={14} />
        </ActionIcon>

        {item.type === "local" && (
          <>
            {item.error ? (
              <ActionIcon
                color="yellow"
                size="sm"
                style={{ position: "absolute", bottom: 2, right: 2 }}
                onClick={() => retryUpload(item.id)}
              >
                <IconRefresh size={14} />
              </ActionIcon>
            ) : (
              item.progress > 0 && (
                <Progress value={item.progress} size="xs" mt={4} />
              )
            )}
          </>
        )}
      </div>
    );
  }

  const handleDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return;

    const oldIndex = images.findIndex((i) => i.id === active.id);
    const newIndex = images.findIndex((i) => i.id === over.id);

    setImages(arrayMove(images, oldIndex, newIndex));
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

  const handleUpdate = async () => {
    try {
      setIsUploading(true);

      const uploadPromises = images.map((img) => {
        if (img.type === "server") {
          return Promise.resolve(img.url);
        }
        if (img.error) {
          throw new Error("Fix failed uploads first");
        }
        return uploadSingle(img);
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
    } catch (err) {
      notifications.show({
        title: "Error",
        message: err.message || "Update failed",
        color: "red",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Container size="lg">
      <Title mb="lg" c="var(--text-primary)">Product Management</Title>

      <Paper
        withBorder
        p="md"
        radius="var(--radius-lg)"
        style={{ borderColor: "var(--border)", background: "var(--bg-card)", boxShadow: "var(--shadow-sm)" }}
      >
        {loading ? (
          <Center><Loader /></Center>
        ) : (
          <SimpleGrid cols={{ base: 1, xs: 2, md: 3, lg: 4 }} spacing="md">
            {products.map((p) => (
              <Paper
                key={p.id}
                withBorder
                p="sm"
                radius="var(--radius-md)"
                style={{ borderColor: "var(--border)" }}
              >
                <Image src={getImageUrl(p.imageUrl)} height={150} radius="var(--radius-sm)" />
                <Text fw={600}>{p.name}</Text>

                {p.categoryName && (
                  <Badge size="xs">{p.categoryName}</Badge>
                )}

                <Group mt="sm" justify="space-between">
                  <Button
                    size="xs"
                    radius="xl"
                    style={{ background: "var(--primary)", color: "#fff", fontWeight: 700 }}
                    onClick={() => openEdit(p)}
                  >
                    Edit
                  </Button>

                  <ActionIcon
                    color="red"
                    variant="light"
                    onClick={() => handleDeleteProduct(p.id)}
                  >
                    <IconTrash size={16} />
                  </ActionIcon>
                </Group>
              </Paper>
            ))}
          </SimpleGrid>
        )}
      </Paper>

      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Edit Product"
        radius="var(--radius-lg)"
        centered
        size="lg"
      >
        <Stack>

          <TextInput
            label="Product Name"
            value={selected?.name || ""}
            onChange={(e) =>
              setSelected((prev) => ({ ...prev, name: e.target.value }))
            }
            styles={{ input: { borderRadius: "var(--radius-md)", borderColor: "var(--border)" } }}
          />

          <Textarea
            label="Description"
            value={selected?.description || ""}
            onChange={(e) =>
              setSelected((prev) => ({ ...prev, description: e.target.value }))
            }
            styles={{ input: { borderRadius: "var(--radius-md)", borderColor: "var(--border)" } }}
          />

          <Group grow>
            <NumberInput
              label="Price"
              value={selected?.price || 0}
              onChange={(value) =>
                setSelected((prev) => ({ ...prev, price: value }))
              }
              styles={{ input: { borderRadius: "var(--radius-md)", borderColor: "var(--border)" } }}
            />

            <NumberInput
              label="Stock"
              value={selected?.stockQuantity || 0}
              onChange={(value) =>
                setSelected((prev) => ({ ...prev, stockQuantity: value }))
              }
              styles={{ input: { borderRadius: "var(--radius-md)", borderColor: "var(--border)" } }}
            />
          </Group>

          <Select
            label="Category"
            data={categories}
            value={categoryId}
            onChange={setCategoryId}
            styles={{ input: { borderRadius: "var(--radius-md)", borderColor: "var(--border)" } }}
          />

          <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext
              items={images.map((i) => i.id)}
              strategy={horizontalListSortingStrategy}
            >
              <Group>
                {images.map((item) => (
                  <SortableItem key={item.id} item={item} />
                ))}
              </Group>
            </SortableContext>
          </DndContext>

          <FileInput
            multiple
            onChange={handleAddImages}
            styles={{ input: { borderRadius: "var(--radius-md)", borderColor: "var(--border)" } }}
          />

          <Button
            radius="xl"
            style={{ background: "var(--primary)", color: "#fff", fontWeight: 700 }}
            onClick={handleUpdate}
            disabled={isUploading}
          >
            {isUploading ? "Uploading..." : "Save Changes"}
          </Button>

        </Stack>
      </Modal>
    </Container>
  );
}