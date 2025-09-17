"use client"

import { useState, useEffect } from "react"
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Spinner,
  Divider,
  Chip,
  Tooltip,
  Tabs,
  Tab,
  Card,
  Switch,
} from "@nextui-org/react"
import Image from "next/image"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Link from '@tiptap/extension-link'
import { useForm, type SubmitHandler, Controller } from "react-hook-form"
import { FaBold, FaItalic, FaListUl, FaListOl, FaImage, FaLink, FaUndo, FaRedo, FaEye } from "react-icons/fa"
import { RiH1, RiH2, RiH3, RiDoubleQuotesL } from "react-icons/ri"
import TextAlign from '@tiptap/extension-text-align'
import {
  Blog,
  CreateBlogDto,
} from '@/Api';
import { toast } from "react-hot-toast"

type props = {
  isOpen: boolean;
  isPending: boolean;
  toggleModal: () => void;
  createBlog: (data: CreateBlogDto) => void;
  selectedBlog: Blog | null;
};

// the text editor
const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) return null

  return (
    <div className="flex flex-wrap gap-1 p-2 rounded-t-lg bg-gray-50 border border-b-0 ">
      <div className="flex items-center gap-1">
        <Tooltip content="Bold" placement="bottom" showArrow>
          <Button
            size="sm"
            variant="light"
            isIconOnly
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={editor.isActive('bold') ? 'bg-gray-200 ' : ''}
          >
            <FaBold className="text-gray-700 " />
          </Button>
        </Tooltip>

        <Tooltip content="Italic" placement="bottom" showArrow>
          <Button
            size="sm"
            variant="light"
            isIconOnly
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={editor.isActive('italic') ? 'bg-gray-200 ' : ''}
          >
            <FaItalic className="text-gray-700 " />
          </Button>
        </Tooltip>
      </div>

      <Divider orientation="vertical" className="h-6" />

      <div className="flex items-center gap-1">
        <Tooltip content="Heading 1" placement="bottom" showArrow>
          <Button
            size="sm"
            variant="light"
            isIconOnly
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={editor.isActive('heading', { level: 1 }) ? 'bg-gray-200 ' : ''}
          >
            <RiH1 className="text-gray-700 " />
          </Button>
        </Tooltip>

        <Tooltip content="Heading 2" placement="bottom" showArrow>
          <Button
            size="sm"
            variant="light"
            isIconOnly
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={editor.isActive('heading', { level: 2 }) ? 'bg-gray-200 ' : ''}
          >
            <RiH2 className="text-gray-700 " />
          </Button>
        </Tooltip>

        <Tooltip content="Heading 3" placement="bottom" showArrow>
          <Button
            size="sm"
            variant="light"
            isIconOnly
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={editor.isActive('heading', { level: 3 }) ? 'bg-gray-200 ' : ''}
          >
            <RiH3 className="text-gray-700 " />
          </Button>
        </Tooltip>
      </div>

      <Divider orientation="vertical" className="h-6" />

      <div className="flex items-center gap-1">
        <Tooltip content="Bullet List" placement="bottom" showArrow>
          <Button
            size="sm"
            variant="light"
            isIconOnly
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={editor.isActive('bulletList') ? 'bg-gray-200 ' : ''}
          >
            <FaListUl className="text-gray-700 " />
          </Button>
        </Tooltip>

        <Tooltip content="Ordered List" placement="bottom" showArrow>
          <Button
            size="sm"
            variant="light"
            isIconOnly
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={editor.isActive('orderedList') ? 'bg-gray-200 ' : ''}
          >
            <FaListOl className="text-gray-700 " />
          </Button>
        </Tooltip>
      </div>

      <Divider orientation="vertical" className="h-6" />

      <div className="flex items-center gap-1">
        <Tooltip content="Blockquote" placement="bottom" showArrow>
          <Button
            size="sm"
            variant="light"
            isIconOnly
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={editor.isActive('blockquote') ? 'bg-gray-200 ' : ''}
          >
            <RiDoubleQuotesL className="text-gray-700 " />
          </Button>
        </Tooltip>

        <Tooltip content="Insert Link" placement="bottom" showArrow>
          <Button
            size="sm"
            variant="light"
            isIconOnly
            onClick={() => {
              const previousUrl = editor.getAttributes('link').href;
              let url = window.prompt('Enter URL', previousUrl || 'https://');

              if (url === null) return;

              if (url && !/^https?:\/\//i.test(url)) {
                url = 'https://' + url;
              }

              try {
                new URL(url);

                if (url === 'https://') {
                  editor.chain().focus().extendMarkRange('link').unsetLink().run();
                } else {
                  editor
                    .chain()
                    .focus()
                    .extendMarkRange('link')
                    .setLink({ href: url })
                    .run();
                }
              } catch (err) {
                alert('Please enter a valid URL (e.g., https://example.com)');
              }
            }}
            className={editor.isActive('link') ? 'bg-gray-200 ' : ''}
          >
            <FaLink className="text-gray-700 " />
          </Button>
        </Tooltip>
      </div>

      <Divider orientation="vertical" className="h-6" />

      <div className="flex items-center gap-1">
        <Tooltip content="Undo" placement="bottom" showArrow>
          <Button
            size="sm"
            variant="light"
            isIconOnly
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
          >
            <FaUndo className="text-gray-700 " />
          </Button>
        </Tooltip>

        <Tooltip content="Redo" placement="bottom" showArrow>
          <Button
            size="sm"
            variant="light"
            isIconOnly
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
          >
            <FaRedo className="text-gray-700 " />
          </Button>
        </Tooltip>
      </div>

      <Divider orientation="vertical" className="h-6" />

      <div className="flex items-center gap-1">
        <Tooltip content="Align Left" placement="bottom" showArrow>
          <Button
            size="sm"
            variant="light"
            isIconOnly
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={editor.isActive({ textAlign: 'left' }) ? 'bg-gray-200 ' : ''}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-700 ">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="15" y2="6"></line>
              <line x1="3" y1="18" x2="15" y2="18"></line>
            </svg>
          </Button>
        </Tooltip>

        <Tooltip content="Align Center" placement="bottom" showArrow>
          <Button
            size="sm"
            variant="light"
            isIconOnly
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={editor.isActive({ textAlign: 'center' }) ? 'bg-gray-200 ' : ''}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-700 ">
              <line x1="18" y1="12" x2="6" y2="12"></line>
              <line x1="21" y1="6" x2="3" y2="6"></line>
              <line x1="21" y1="18" x2="3" y2="18"></line>
            </svg>
          </Button>
        </Tooltip>

        <Tooltip content="Align Right" placement="bottom" showArrow>
          <Button
            size="sm"
            variant="light"
            isIconOnly
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={editor.isActive({ textAlign: 'right' }) ? 'bg-gray-200 ' : ''}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-700 ">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="9" y1="6" x2="21" y2="6"></line>
              <line x1="9" y1="18" x2="21" y2="18"></line>
            </svg>
          </Button>
        </Tooltip>

        <Tooltip content="Justify" placement="bottom" showArrow>
          <Button
            size="sm"
            variant="light"
            isIconOnly
            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
            className={editor.isActive({ textAlign: 'justify' }) ? 'bg-gray-200 ' : ''}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-700 ">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </Button>
        </Tooltip>
      </div>
    </div>
  )
}

function CreateBlogModal({
  isOpen,
  toggleModal,
  createBlog,
  isPending,
  selectedBlog
}: props) {
  const {
    handleSubmit,
    register,
    watch,
    setValue,
    reset,
    control,
    formState: { errors },
  } = useForm<CreateBlogDto | Blog>();

  const onSubmit: SubmitHandler<CreateBlogDto | Blog> = (data) => {
    
    if (!data.blogTitle || !data.content) {
      toast.error("Blog title and content are required");
      return;
    }
    if (!data.image) {
      toast.error("Cover image is required");
      return;
    }


    const formData = new FormData();
    formData.append("BlogTitle", String(data.blogTitle));
    formData.append("blogTitle", String(data.blogTitle));
    formData.append("content", String(data.content));

    if (data.image) {
      if (typeof data.image === 'string') {
        formData.append("image", data.image);
      } else {
        formData.append("image", data.image);
      }
    }

    if (selectedBlog?.id) {
      formData.append("id", selectedBlog.id);
    }

    // Create submission object with proper types
    const submissionData = {
      ...Object.fromEntries(formData),
      isActive: Boolean(data.isActive || false)
    };

    // @ts-ignore
    createBlog(submissionData);
  };

  useEffect(() => {
    reset(selectedBlog || {});
  }, [selectedBlog, isOpen, setValue, reset]);

  const [image, SetImage] = useState<any>();
  const [imageValidationError, setImageValidationError] = useState<string>('');
  const [selectedTab, setSelectedTab] = useState("write");

  const onImageChange = (file: File) => {
    setImageValidationError('');

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setImageValidationError('Image size must be less than 5MB');
      return;
    }

    // Check image dimensions
    const img = document.createElement('img');
    img.onload = () => {
      const { width, height } = img;
      // If all validations pass
      SetImage(URL.createObjectURL(file));
      setImageFile(file);
      setImageDimensions({ width, height });
      // @ts-ignore
      setValue('image', new Blob([file], { type: file.type }));
    };

    img.onerror = () => {
      setImageValidationError('Invalid image file');
    };

    img.src = URL.createObjectURL(file);
  };

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 hover:text-blue-800 underline',
        },
      }),
    ],
    content: selectedBlog?.content || "",
    onUpdate: ({ editor }) => {
      setValue("content", editor.getHTML())
    },
  })

  // Set data when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedTab("write") // Always start with Write tab
      if (selectedBlog) {
        // Wait a bit to ensure previous reset completed
        setTimeout(() => {
          reset(selectedBlog)
          editor?.commands.setContent(selectedBlog.content || "")
          setImageValidationError("")
          setImageDimensions(null)
        }, 150)
      } else {
        // New blog creation
        setTimeout(() => {
          reset({
            blogTitle: "",
            content: "",
            image: "",
            isActive: false
          })
          editor?.commands.clearContent()
          setImageValidationError("")
          setImageDimensions(null)
          SetImage(null)
          setImageFile(null)
        }, 150)
      }
    }
  }, [selectedBlog, isOpen, reset, editor])

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imageDimensions, setImageDimensions] = useState<{ width: number, height: number } | null>(null)

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={toggleModal}
      placement="top-center"
      size="4xl"
      scrollBehavior="inside"
      classNames={{
        base: "max-h-[90vh] overflow-scroll",
        body: "py-2",
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-800 ">
                {selectedBlog?.id ? "Edit Blog Post" : "Create New Blog Post"}
              </h2>
              <p className="text-sm text-gray-500 ">
                {selectedBlog?.id ? "Update your blog content" : "Fill in the details to create your blog post"}
              </p>
            </div>
          </div>
        </ModalHeader>
        <form onSubmit={handleSubmit(onSubmit as SubmitHandler<Blog | CreateBlogDto>)}>
          <ModalBody className="gap-4 py-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Blog Title */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 ">Blog Title</label>
                  <Controller
                    name="blogTitle"
                    control={control}
                    defaultValue=""
                    rules={{
                      required: "Blog title is required",
                      minLength: {
                        value: 2,
                        message: "Title should be at least 2 characters"
                      }
                    }}
                    render={({ field }) => (
                      <Input
                        variant="bordered"
                        placeholder="Enter a compelling title for your blog post"
                        value={watch('blogTitle')}
                        {...register('blogTitle', {
                          required: 'This Field is required'
                        })}
                        isInvalid={!!errors.blogTitle}
                        errorMessage={errors?.blogTitle?.message}
                        classNames={{
                          input: "text-lg",
                        }}
                      />
                    )}
                  />
                </div>

                {/* Content Editor */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-gray-700 ">Blog Content</label>
                    <span className="text-xs text-gray-500 ">
                      {watch("content")?.length ? `${(watch("content") ?? '').replace(/<[^>]*>/g, '').length} characters` : ''}
                    </span>
                  </div>

                  <Controller
                    name="content"
                    control={control}
                    defaultValue=""
                    rules={{
                      required: "Blog content is required",
                      validate: (value) => {
                        const text = (value ?? '').replace(/<[^>]*>/g, '')
                        return text.length > 0 || "Blog content cannot be empty"
                      }
                    }}
                    render={({ field }) => (
                      <Tabs
                        selectedKey={selectedTab}
                        onSelectionChange={(key) => setSelectedTab(key as string)}
                        classNames={{
                          tabList: "bg-gray-100  rounded-t-lg ml-2 ",
                          cursor: "bg-white ",
                          tab: "text-gray-600 ",
                        }}
                      >
                        <Tab key="write" title="Write">
                          <div className="border rounded-lg overflow-hidden bg-white  mr-4">
                            <MenuBar editor={editor} />
                            <div
                              id="blog-content"
                              className="p-4 min-h-[300px] max-h-[400px] overflow-y-auto prose prose-sm max-w-none focus:outline-none "
                            >
                              <EditorContent
                                editor={editor}
                                {...field}
                                className="h-full focus:outline-none"
                              />
                            </div>
                            <div className="px-4 py-2 bg-gray-50  border-t text-xs text-gray-500 ">
                              Tip: Use headings, lists and formatting to make your content readable
                            </div>
                          </div>
                        </Tab>
                        <Tab key="preview" title="Preview">
                          <Card className="p-4 min-h-[300px] max-h-[400px] overflow-y-auto mr-4">
                            <div
                              className="prose prose-sm max-w-none "
                              dangerouslySetInnerHTML={{ __html: editor?.getHTML() || '' }}
                            />
                          </Card>
                        </Tab>
                      </Tabs>
                    )}
                  />
                  {errors.content && (
                    <p className="text-xs text-red-500 mt-1">{errors.content.message}</p>
                  )}
                </div>
              </div>

              {/* Right Column - Sidebar */}
              <div className="space-y-6">
                {/* Publication Settings */}
                <Card className="p-4">
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-gray-700 ">Publication Settings</h3>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col flex-1 min-w-0">
                        <span className="text-sm font-medium text-gray-700 ">Publish Status</span>
                        <span className="text-xs text-gray-500  flex items-center">
                          {watch('isActive') ? 'Blog is published and visible' : 'Blog is saved as draft'}
                        </span>
                      </div>
                      <div className="flex-shrink-0 ml-4">
                        <Switch
                          isSelected={watch('isActive') || false}
                          onValueChange={(value) => setValue('isActive', value)}
                          color="success"
                          size="sm"
                        >
                          <span className="inline-block w-16 text-center">
                            {watch('isActive') ? 'Published' : 'Draft'}
                          </span>
                        </Switch>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Cover Image */}
                <Card className="p-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-700 ">Cover Image</label>
                      {image || watch("image") ? (
                        <Button
                          size="sm"
                          variant="light"
                          color="danger"
                          onClick={() => {
                            SetImage(null)
                            setImageFile(null)
                            setImageDimensions(null)
                            setValue("image", "")
                            setImageValidationError("")
                          }}
                        >
                          Remove
                        </Button>
                      ) : null}
                    </div>

                    {!watch("image") && !image ? (
                      <div>
                        <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${imageValidationError
                            ? 'border-red-300 bg-red-50 hover:bg-red-100'
                            : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                          }`}>
                          <label className="cursor-pointer">
                            <FaImage className={`mx-auto text-3xl mb-3 ${imageValidationError ? 'text-red-400' : 'text-gray-400'
                              }`} />
                            <p className="text-sm text-gray-600  mb-2">Click to upload or drag and drop</p>
                            <p className="text-xs text-gray-400  mb-1">PNG, JPG, GIF (Max. 5MB)</p>
                            <div className="text-xs text-gray-500 space-y-1">
                              <p>
                                <span className="font-medium">Required:</span> Min. 800×450px
                              </p>
                              <p>
                                <span className="font-medium">Aspect ratio:</span> 16:9, 16:10, or 4:3
                              </p>
                              <p>
                                <span className="font-medium">Recommended:</span> 1920×1080px (16:9)
                              </p>
                            </div>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => e.target.files && onImageChange(e.target.files[0])}
                            />
                          </label>
                        </div>
                        {imageValidationError && (
                          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-600">
                            <strong>Error:</strong> {imageValidationError}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3">
                        <div className="relative w-full aspect-video rounded-lg overflow-hidden border ">
                          <Image
                            src={image || watch("image")}
                            alt="Blog Cover Preview"
                            fill
                            className="object-cover"
                            sizes="(min-width: 640px) 640px, 100vw"
                          />
                        </div>
                        <div className="flex flex-col gap-1 text-xs text-gray-500 ">
                          {imageFile && (
                            <>
                              <span className="font-medium">{imageFile.name}</span>
                              <div className="flex items-center gap-3">
                                <span>Size: {(imageFile.size / 1024 / 1024).toFixed(2)} MB</span>
                                {imageDimensions && (
                                  <span>Dimensions: {imageDimensions.width}×{imageDimensions.height}px</span>
                                )}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </Card>

                {/* Quick Info Card */}
                <Card className="p-4">
                  <h3 className="text-sm font-medium text-gray-700  mb-4">Content Summary</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500 ">Title Length</span>
                      <span className="text-gray-700 ">{watch('blogTitle')?.length || 0} chars</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 ">Content Length</span>
                      <span className="text-gray-700 ">
                        {watch('content') ? (watch('content') ?? '').replace(/<[^>]*>/g, '').length : 0} chars
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 ">Status</span>
                      <span className="text-gray-700 ">
                        {watch('isActive') ? 'Published' : 'Draft'}
                      </span>
                    </div>
                    <div className="pt-2 border-t border-gray-200 ">
                      <p className="text-xs text-gray-500 ">
                        💡 Use the <strong>Preview</strong> tab to see how your content will look
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </ModalBody>

          <ModalFooter className="border-t">
            <Button
              variant="light"
              onPress={toggleModal}
              className="text-gray-600 "
            >
              Cancel
            </Button>
            <Button
              color="primary"
              type="submit"
              isDisabled={isPending}
              className="font-medium"
            >
              {isPending ? (
                <Spinner color="white" size="sm" />
              ) : selectedBlog?.id ? (
                watch('isActive') ? "Update & Publish" : "Update as Draft"
              ) : (
                watch('isActive') ? "Publish Blog" : "Save as Draft"
              )}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}

export default CreateBlogModal;