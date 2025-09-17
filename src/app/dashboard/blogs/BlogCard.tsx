"use client"

import { Button, Card, CardFooter, Tooltip } from '@nextui-org/react';
import Image from 'next/image';
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Blog } from '@/Api';
import {
  FiEdit2,
  FiTrash2,
  FiCalendar,
  FiEye,
  FiClock,
  FiX,
  FiCheckCircle
} from 'react-icons/fi';
import { FaGripVertical } from "react-icons/fa";

type props = {
  item: Blog;
  setSelectedBlog: (data: any) => void;
  toggleModal: () => void;
  handleOpenDeleteModal: (data: any) => void;
  dragging: boolean;
  onViewDetails: (blog: Blog) => void;
};

function BlogCard({
  item,
  setSelectedBlog,
  toggleModal,
  handleOpenDeleteModal,
  dragging,
  onViewDetails
}: props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: dragging && transition,
    zIndex: isDragging ? '100' : 'auto',
    opacity: isDragging ? 0.4 : 1,
    scale: isDragging ? 1.05 : 1,
    boxShadow: isDragging ? '0 8px 16px rgba(0,0,0,0.1)' : 'none',
  };

  // Format date to relative time (e.g., "2 hours ago")
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

  return (
    <div
      ref={setNodeRef}
      style={style as React.CSSProperties}
      className="relative z-[1] self-start w-[380px]"
    >
      <Card
        className={`h-[450px] border border-gray-200 hover:border-primary-200 transition-all duration-300 group bg-white  ${isDragging ? 'cursor-grabbing' : ''}`}
        shadow="none"
      >
        {/* Image Section */}
        <div className="relative min-h-[200px] max-h-[200px] w-full overflow-hidden">
          <Image
            alt={`${item?.blogTitle || 'Blog post'} thumbnail`}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="320px"
            priority
            fill
            src={item?.image || '/hero-card-complete.jpeg'}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

          {/* Drag Handle */}
          <Tooltip content="Drag to reorder">
            <button
              {...attributes}
              {...listeners}
              className={`absolute top-3 right-3 rounded-md p-2 bg-white/90 backdrop-blur-sm hover:bg-white transition-all duration-200 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'} shadow-sm hover:shadow-md`}
              aria-label="Drag to reorder"
            >
              <FaGripVertical className="text-neutral-600" size={16} />
            </button>
          </Tooltip>
        </div>

        {/* Content Section */}
        <div className="flex flex-col p-5 flex-1">
          {/* Title */}
          <h3 className="text-lg font-bold text-gray-900  group-hover:text-primary-600 transition-colors line-clamp-2">
            {item?.blogTitle || "Untitled Blog Post"}
          </h3>

          {/* Meta Information */}
          <div className="flex items-center text-xs text-neutral-500 mt-4 space-x-4">
            <div className="flex items-center">
              <FiCalendar size={14} className="mr-1.5" />
              <span>{new Date(item?.createdAt || Date.now()).toLocaleDateString()}</span>
            </div>

            <div className="flex items-center">
              <FiClock size={14} className="mr-1.5" />
              <span>{formatRelativeTime(new Date(item?.createdAt || Date.now()))}</span>
            </div>
            {item?.isActive && <div className="flex items-center">
              <FiCheckCircle className="mr-1.5 text-success" />
              <span>Published</span>
            </div>}
            {!item?.isActive && <div className="flex items-center">
              <FiX className="mr-1.5 text-danger" />
              <span>Draft</span>
            </div>}
          </div>

          {/* Preview Content */}
          <div className="mt-4 text-sm text-gray-600  line-clamp-3">
            {item?.content?.replace(/<[^>]*>/g, '').slice(0, 150) || "No content available"}
          </div>
        </div>

        {/* Action Buttons */}
        <CardFooter className="flex justify-between items-center gap-2 p-4 border-t border-gray-100 ">
          <div className="flex gap-2 flex-1">
            <Tooltip content="View details">
              <Button
                onClick={() => onViewDetails(item)}
                className="bg-gray-50 text-gray-700 hover:bg-gray-100 transition-all flex-1"
                size="sm"
                startContent={<FiEye size={16} />}
                aria-label="View blog details"
              >
                View
              </Button>
            </Tooltip>
            <Tooltip content="Edit blog">
              <Button
                onClick={() => {
                  setSelectedBlog(item);
                  toggleModal();
                }}
                className="bg-primary-50 text-primary-600 hover:bg-primary-100 transition-all flex-1"
                size="sm"
                startContent={<FiEdit2 size={16} />}
                aria-label="Edit blog"
              >
                Edit
              </Button>
            </Tooltip>
          </div>
          <Tooltip content="Delete blog">
            <Button
              onClick={() => handleOpenDeleteModal(item)}
              color="danger"
              variant="flat"
              size="sm"
              className="flex-1"
              startContent={<FiTrash2 size={16} />}
              aria-label="Delete blog"
            >
              Delete
            </Button>
          </Tooltip>
        </CardFooter>
      </Card>
    </div>
  );
}

export default BlogCard;