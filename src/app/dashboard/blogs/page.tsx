'use client';
import { Button, Skeleton, Modal, ModalContent, ModalHeader, ModalBody, Image, Chip, Card } from '@nextui-org/react';
import React, { useState, useMemo, useEffect } from 'react';
import { MdAddCircle, MdOutlineArticle, } from 'react-icons/md';
import { FiEdit2, FiX, FiCalendar, FiCheckCircle, FiTrash2, FiRefreshCw, FiFileText, FiClock } from 'react-icons/fi';
import CreateBlogModal from './CreateBlogModal';
import BeforeDeleteModal from '@/components/BeforeDeleteModal';
import { Blog, CreateBlogDto, UpdateBlogDto, UpdateItemsOrderDto } from '@/Api';
import { useQuery, useMutation } from '@tanstack/react-query';
import { BlogsApi } from '@/Api/apis/blogs-api';
import { ImagesApi } from '@/Api/apis/images-api';
import { AXIOS_CONFIG } from '@/Api/wrapper';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { motion, AnimatePresence } from 'framer-motion';
import BlogCard from './BlogCard';

// Helper function for relative time formatting
const formatRelativeTime = (date: Date) => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} day${days === 1 ? '' : 's'} ago`;
  if (hours > 0) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  if (minutes > 0) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  return 'Just now';
};

export default function Blogs() {
  // State management
  const [allBlogs, setAllBlogs] = useState<Blog[]>([]);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDetailsModalOpen, setDetailsModalOpen] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [isReordering, setIsReordering] = useState(false);

  // Toggle functions
  const toggleCreateModal = () => {
    setCreateModalOpen(!isCreateModalOpen)
    if (isCreateModalOpen) {
      setSelectedBlog(null);
    }
  }
  const toggleDeleteModal = () => setDeleteModalOpen(!isDeleteModalOpen);
  const toggleDetailsModal = () => setDetailsModalOpen(!isDetailsModalOpen);


  // API mutations
  const { mutate: createBlog, isPending: isCreatePending } = useMutation({
    mutationKey: ['createBlog'],
    mutationFn: async (body: any) => {
      if (typeof body?.image === 'object') {
        const result = await new ImagesApi(AXIOS_CONFIG).uploadImageForm(body.image as any);
        body.image = result?.data;
      }

      return body?.id
        ? await new BlogsApi(AXIOS_CONFIG).updateBlog(body as UpdateBlogDto, body.id)
        : await new BlogsApi(AXIOS_CONFIG).createBlog(body as CreateBlogDto);
    },
    onSuccess: () => {
      refetch();
      toggleCreateModal();
    }
  });

  const { mutate: deleteBlog, isPending: isDeletePending } = useMutation({
    mutationKey: ['deleteBlog'],
    mutationFn: () => new BlogsApi(AXIOS_CONFIG).deleteBlog(selectedBlog?.id || ''),
    onSuccess: () => {
      refetch();
      toggleDeleteModal();
    }
  });

  const { mutate: updateOrder } = useMutation({
    mutationKey: ['updateOrder'],
    mutationFn: (body: UpdateItemsOrderDto) => new BlogsApi(AXIOS_CONFIG).updateBlogsOrder(body),
    onSuccess: () => {
      refetch();
      setIsReordering(false);
    }
  });

  // API queries
  const { isLoading, isError, refetch, isRefetching, isFetched } = useQuery({
    queryKey: ['blogs'],
    queryFn: async () => {
      const response = await new BlogsApi(AXIOS_CONFIG).getAllBlogsForDashboard();
      setAllBlogs(response.data);
      return response.data;
    }
  });

  useEffect(() => { refetch() }, []);

  // Modal handlers
  const handleOpenDeleteModal = (blog: Blog) => {
    setSelectedBlog(blog);
    toggleDeleteModal();
  };

  const handleViewDetails = (blog: Blog) => {
    setSelectedBlog(blog);
    toggleDetailsModal();
  };

  // Drag and drop handlers
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10
      }
    }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setIsReordering(true);
      setAllBlogs((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);
        const newOrder = arrayMove(items, oldIndex, newIndex);
        updateOrder({ ids: newOrder.map(item => item.id.toString()) });
        return newOrder;
      });
    }
    setDragging(false);
  };

  return (
    <div className="flex flex-col bg-gray-50 min-h-screen">
      {/* Modals */}
      <CreateBlogModal
        isOpen={isCreateModalOpen}
        toggleModal={toggleCreateModal}
        createBlog={createBlog}
        isPending={isCreatePending}
        selectedBlog={selectedBlog}
      />

      <BeforeDeleteModal
        isOpen={isDeleteModalOpen}
        toggleDeleteModal={toggleDeleteModal}
        onDelete={deleteBlog}
      />

      <Modal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          toggleDetailsModal();
          setSelectedBlog(null);
        }}
        size="4xl"
        classNames={{
          base: "bg-white ",
          header: "border-b border-gray-200 ",
          footer: "border-t border-gray-200 ",
        }}
      >
        <ModalContent className='w-full max-w-5xl h-[90vh] overflow-scroll'>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
                      {selectedBlog?.blogTitle || "Untitled Blog"}
                    </h3>
                    <div className="flex items-center text-sm text-default-500 space-x-4">
                      <div className="flex items-center">
                        <FiCalendar className="mr-1.5" />
                        <span>{new Date(selectedBlog?.createdAt || Date.now()).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center">
                        <FiClock className="mr-1.5" />
                        <span>{formatRelativeTime(new Date(selectedBlog?.createdAt || Date.now()))}</span>
                      </div>
                      {selectedBlog?.isActive && <div className="flex items-center">
                        <FiCheckCircle className="mr-1.5 text-success" />
                        <span>Published</span>
                      </div>}
                      {!selectedBlog?.isActive && <div className="flex items-center">
                        <FiX className="mr-1.5 text-danger" />
                        <span>Draft</span>
                      </div>}
                    </div>
                  </div>
                </div>
              </ModalHeader>
              <ModalBody className="p-0">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
                  {/* Main Content */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Cover Image */}
                    <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-gray-200 ">
                      <Image
                        src={selectedBlog?.image || '/default-blog.jpg'}
                        alt="Blog cover"
                        className="object-cover"
                        width={800}
                        height={400}
                        sizes="(min-width: 1024px) 66vw, 100vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                    </div>

                    {/* Blog Content */}
                    <div className="prose prose-lg max-w-none ">
                      {selectedBlog?.content ? (
                        <div className="prose max-w-none text-gray-800 ">
                          <div
                            dangerouslySetInnerHTML={{ __html: selectedBlog.content }}
                            className="[&>h1]:text-3xl [&>h1]:font-bold [&>h1]:my-6 [&>h1]:text-gray-900 
                                  [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:my-5 [&>h2]:text-gray-800 
                                  [&>h3]:text-xl [&>h3]:font-bold [&>h3]:my-4 [&>h3]:text-gray-700 
                                  [&>p]:text-gray-600  [&>p]:my-4 [&>p]:leading-relaxed
                                  [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:my-4 [&>ol]:text-gray-600 
                                  [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:my-4 [&>ul]:text-gray-600 
                                  [&>li]:my-2 [&>li]:text-gray-600 
                                  [&>blockquote]:border-l-4 [&>blockquote]:border-primary-500 [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:my-4
                                  [&>a]:text-primary-600 [&>a]:hover:underline
                                  [&>img]:max-w-full [&>img]:h-auto [&>img]:rounded-lg [&>img]:my-6
                                  [&>code]:bg-gray-100  [&>code]:px-2 [&>code]:py-1 [&>code]:rounded
                                  [&>pre]:bg-gray-100  [&>pre]:p-4 [&>pre]:rounded-lg [&>pre]:my-4"
                          />
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-gray-500 ">
                          <FiFileText className="text-4xl mb-4" />
                          <p>No content available</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Sidebar */}
                  <div className="space-y-6">
                    {/* Blog Info Card */}
                    <Card className="p-4">
                      <h4 className="text-sm font-medium text-gray-700  mb-4">Blog Information</h4>
                      <div className="space-y-3">
                        {!selectedBlog?.isActive &&
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500 ">Status</span>
                            <Chip color="danger" variant="flat" size="sm">Draft</Chip>
                          </div>}
                        {selectedBlog?.isActive &&
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500 ">Status</span>
                            <Chip color="success" variant="flat" size="sm">Published</Chip>
                          </div>
                        }
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500 ">Created</span>
                          <span className="text-gray-700 ">
                            {new Date(selectedBlog?.createdAt || Date.now()).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500 ">Last Updated</span>
                          <span className="text-gray-700 ">
                            {new Date(selectedBlog?.createdAt || Date.now()).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500 ">Content Length</span>
                          <span className="text-gray-700 ">
                            {selectedBlog?.content ? `${selectedBlog.content.replace(/<[^>]*>/g, '').length} characters` : '0 characters'}
                          </span>
                        </div>
                      </div>
                    </Card>

                    {/* Quick Actions Card */}
                    <Card className="p-4">
                      <h4 className="text-sm font-medium text-gray-700  mb-4">Quick Actions</h4>
                      <div className="space-y-2">
                        <Button
                          color="primary"
                          variant="flat"
                          className="w-full justify-start"
                          startContent={<FiEdit2 />}
                          onClick={() => {
                            onClose();
                            if (selectedBlog) {
                              setSelectedBlog(selectedBlog);
                              toggleCreateModal();
                            }
                          }}
                        >
                          Edit Blog
                        </Button>
                        <Button
                          color="danger"
                          variant="flat"
                          className="w-full justify-start"
                          startContent={<FiTrash2 />}
                          onClick={() => {
                            onClose();
                            if (selectedBlog) {
                              handleOpenDeleteModal(selectedBlog);
                            }
                          }}
                        >
                          Delete Blog
                        </Button>
                      </div>
                    </Card>
                  </div>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Enhanced Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col gap-6">
            {/* Title Section */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent flex items-center gap-2">
                  <MdOutlineArticle className="text-primary-600" size={28} />
                  Blog Posts
                </h1>
                <p className="text-sm text-gray-500 mt-2">
                  {allBlogs?.length || 0} {allBlogs?.length === 1 ? 'post' : 'posts'} available
                  {(isLoading || isReordering || isCreatePending || isDeletePending || isRefetching) &&
                    <span className="ml-2 text-primary-500">
                      {
                        isLoading && 'Loading...' ||
                        isReordering && 'Reordering...' ||
                        isCreatePending && 'Creating...' ||
                        isDeletePending && 'Deleting...' ||
                        isRefetching && 'Refetching...' ||
                        ''
                      }
                    </span>
                  }
                  <Button
                    isIconOnly
                    variant="flat"
                    onClick={() => refetch()}
                    size="sm"
                    className='ml-4'
                  >
                    <FiRefreshCw className={isLoading || isReordering || isCreatePending || isDeletePending || isRefetching ? 'animate-spin' : ''} />
                  </Button>
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={toggleCreateModal}
                  startContent={<MdAddCircle size={20} />}
                  color="primary"
                  size="lg"
                  className="font-medium"
                >
                  New Blog
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Blog Grid */}
      <div className="container mx-auto px-6 py-8 flex-1">
        {isError ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-16 text-center bg-red-50 rounded-xl"
          >
            <FiX className="text-red-500 mb-4" size={48} />
            <h3 className="text-xl font-medium text-gray-900 mb-2">Failed to load blog posts</h3>
            <p className="text-gray-600 mb-6 max-w-md">
              We couldn't load the blog posts. Please check your connection and try again.
            </p>
            <Button
              onClick={() => refetch()}
              color="danger"
              variant="flat"
              startContent={<FiCheckCircle />}
            >
              Retry
            </Button>
          </motion.div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            onDragStart={() => setDragging(true)}
            onDragCancel={() => setDragging(false)}
          >
            <SortableContext items={allBlogs.map(blog => blog.id.toString())} strategy={rectSortingStrategy}>
              <div className="flex flex-row flex-wrap gap-6 ">
                <AnimatePresence>
                  {isFetched && allBlogs.length > 0 && !isLoading && (
                    allBlogs.map(blog => (
                      <motion.div
                        key={blog.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                      >
                        <BlogCard
                          item={blog}
                          setSelectedBlog={setSelectedBlog}
                          toggleModal={toggleCreateModal}
                          handleOpenDeleteModal={handleOpenDeleteModal}
                          dragging={dragging}
                          onViewDetails={handleViewDetails}
                        />
                      </motion.div>
                    ))
                  )}
                  {isFetched && allBlogs.length === 0 && !isLoading && !isRefetching &&
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="col-span-full flex flex-col items-center justify-center py-16 text-center mx-auto"
                    >
                      <div className="bg-primary-50 p-6 rounded-full mb-4 text-primary-500">
                        <MdOutlineArticle size={48} />
                      </div>
                      <h3 className="text-xl font-medium text-gray-900 mb-2">No blog posts found</h3>
                      <p className="text-gray-500 mb-6 max-w-md">
                        Start by creating your first blog post to share with your audience.
                      </p>
                      <Button
                        onClick={toggleCreateModal}
                        startContent={<MdAddCircle size={20} />}
                        color="primary"
                        size="lg"
                      >
                        Create First Post
                      </Button>
                    </motion.div>}
                </AnimatePresence>
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>
    </div>
  );
}