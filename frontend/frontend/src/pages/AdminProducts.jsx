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
} from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { useEffect, useState } from "react";
import api from "../api/axios";
import { getImageUrl } from "../utils/image";

// 🔥 DND KIT
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
  const [loading, setLoading] = useState(true);

  const [opened, setOpened] = useState(false);
  const [selected, setSelected] = useState(null);

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
    setImageFiles([]);
    setPreview([]);
    setOpened(true);
  };

  // 🔥 DELETE PRODUCT
  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    await api.delete(`/api/admin/products/${id}`);

    notifications.show({
      title: "Deleted",
      message: "Product deleted",
      color: "green",
    });

    fetchProducts();
  };

  // 🔥 DELETE IMAGE
  const handleDeleteImage = async (imgUrl) => {
    await api.delete(
      `/api/admin/products/${selected.id}/image?imageUrl=${encodeURIComponent(imgUrl)}`
    );

    setSelected((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((i) => i !== imgUrl),
    }));
  };

  // 🔥 DND SORTABLE ITEM
  function SortableItem({ id }) {
    const { attributes, listeners, setNodeRef, transform, transition } =
      useSortable({ id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      cursor: "grab",
      position: "relative",
    };

    return (
      <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
        <Image src={getImageUrl(id)} width={90} height={90} radius="md" />

        <ActionIcon
          color="red"
          size="sm"
          style={{ position: "absolute", top: 0, right: 0 }}
          onClick={() => handleDeleteImage(id)}
        >
          <IconTrash size={14} />
        </ActionIcon>
      </div>
    );
  }

  // 🔥 HANDLE DRAG END
  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = selected.imageUrls.indexOf(active.id);
    const newIndex = selected.imageUrls.indexOf(over.id);

    const newImages = arrayMove(selected.imageUrls, oldIndex, newIndex);

    setSelected((prev) => ({
      ...prev,
      imageUrls: newImages,
    }));
  };

  // 🔥 UPDATE
  const handleUpdate = async () => {
    let uploadedUrls = [];

    if (imageFiles.length > 0) {
      for (let file of imageFiles) {
        const formData = new FormData();
        formData.append("file", file);

        const res = await api.post("/api/admin/products/upload", formData);
        uploadedUrls.push(res.data.data);
      }
    }

    const finalImages =
      uploadedUrls.length > 0
        ? [...selected.imageUrls, ...uploadedUrls]
        : selected.imageUrls;

    await api.put(`/api/admin/products/${selected.id}`, {
      name: selected.name,
      description: selected.description,
      price: selected.price,
      stockQuantity: selected.stockQuantity,
      imageUrl: finalImages[0],
      imageUrls: finalImages,
    });

    notifications.show({
      title: "Updated",
      message: "Product updated",
      color: "green",
    });

    setOpened(false);
    fetchProducts();
  };

  return (
    <Container size="lg">
      <Title mb="lg">Product Management</Title>

      <Paper withBorder p="md">
        {loading ? (
          <Center><Loader /></Center>
        ) : (
          <SimpleGrid cols={4}>
            {products.map((p) => (
              <Paper key={p.id} withBorder p="sm">
                <Image
                  src={getImageUrl(p.imageUrl)}
                  height={150}
                />

                <Text fw={600}>{p.name}</Text>

                <Group mt="sm">
                  <Button size="xs" onClick={() => openEdit(p)}>
                    Edit
                  </Button>

                  <Button
                    size="xs"
                    color="red"
                    onClick={() => handleDeleteProduct(p.id)}
                  >
                    Delete
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

          {/* 🔥 DRAG AREA */}
          <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext
              items={selected?.imageUrls || []}
              strategy={horizontalListSortingStrategy}
            >
              <Group>
                {selected?.imageUrls?.map((img) => (
                  <SortableItem key={img} id={img} />
                ))}
              </Group>
            </SortableContext>
          </DndContext>

          {/* UPLOAD */}
          <FileInput
            multiple
            onChange={(files) => {
              const arr = Array.isArray(files) ? files : [files];
              setImageFiles(arr);
              setPreview(arr.map((f) => URL.createObjectURL(f)));
            }}
          />

          <Group>
            {preview.map((p, i) => (
              <Image key={i} src={p} width={80} height={80} />
            ))}
          </Group>

          <Button onClick={handleUpdate}>Save Changes</Button>

        </Stack>
      </Modal>
    </Container>
  );
}