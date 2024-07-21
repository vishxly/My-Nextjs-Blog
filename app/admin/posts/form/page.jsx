"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { usePostForm } from "./contexts/PostFormContext";
import { useCategories } from "@/lib/firebase/category/read";
import { useAuthors } from "@/lib/firebase/author/read";
import { RTEField } from "./components/RTEField";

export default function Page() {
  const searchParams = useSearchParams();
  const updatePostId = searchParams.get("id");

  const {
    data,
    isLoading,
    error,
    isDone,
    handleData,
    handleCreate,
    handleUpdate,
    handleDelete,
    image,
    setImage,
    fetchData,
  } = usePostForm();

  useEffect(() => {
    if (updatePostId) {
      fetchData(updatePostId);
    }
  }, [updatePostId]);

  return (
    <main className="w-full p-3 md:p-6 flex flex-col gap-3 dark:bg-gray-900 dark:text-white min-h-screen">
      <div className="flex gap-3 md:gap-5 items-center flex-wrap">
        {updatePostId && (
          <div className="flex">
            <h3 className="text-white bg-orange-500 px-3 md:px-4 py-1 md:py-2 rounded-full text-xs font-bold">
              Update
            </h3>
          </div>
        )}
        {!updatePostId && (
          <div className="flex">
            <h3 className="text-white bg-green-500 px-3 md:px-4 py-1 md:py-2 rounded-full text-xs font-bold">
              Create
            </h3>
          </div>
        )}
        <h1 className="font-bold">Posts | Form</h1>
      </div>
      <section className="flex flex-col md:flex-row gap-5">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (updatePostId) {
              handleUpdate();
            } else {
              handleCreate();
            }
          }}
          className="flex flex-col gap-2 bg-blue-50 rounded-xl p-4 md:p-7 w-full md:w-1/2 dark:bg-gray-900 dark:text-white"
        >
          <FormFields
            data={data}
            handleData={handleData}
            updatePostId={updatePostId}
            image={image}
            setImage={setImage}
          />
          <FormButtons
            isLoading={isLoading}
            isDone={isDone}
            updatePostId={updatePostId}
            handleDelete={handleDelete}
            error={error}
          />
        </form>
        <div className="w-full md:w-1/2">
          <RTEField />
        </div>
      </section>
    </main>
  );
}

function FormFields({ data, handleData, updatePostId, image, setImage }) {
  return (
    <>
      <InputField
        label="Title"
        value={data?.title}
        onChange={(e) => handleData("title", e.target.value)}
        required
      />
      <InputField
        label="Post Slug"
        value={data?.slug}
        onChange={(e) => handleData("slug", e.target.value)}
        disabled={updatePostId}
        required
      />
      <SelectCategoryField />
      <SelectAuthorField />
      <ImagePreview imageURL={data?.imageURL} image={image} />
      <ImageUploadField setImage={setImage} />
    </>
  );
}

function InputField({ label, value, onChange, disabled, required }) {
  return (
    <div className="flex flex-col gap-2 ">
      <label className="text-sm text-gray-500">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        className="px-4 py-2 rounded-full border bg-gray-50"
        placeholder={`Enter ${label}`}
        type="text"
        onChange={onChange}
        value={value}
        disabled={disabled}
        required={required}
      />
    </div>
  );
}

function ImagePreview({ imageURL, image }) {
  if (!imageURL && !image) return null;
  return (
    <div>
      <img
        className="h-40 object-cover"
        src={image ? URL.createObjectURL(image) : imageURL}
        alt=""
      />
    </div>
  );
}

function ImageUploadField({ setImage }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm text-gray-500">Image</label>
      <input
        className="px-4 py-2 rounded-full border bg-gray-50"
        type="file"
        accept="image/*"
        onChange={(e) => {
          e.preventDefault();
          setImage(e.target.files[0]);
        }}
      />
    </div>
  );
}

function FormButtons({ isLoading, isDone, updatePostId, handleDelete, error }) {
  return (
    <>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {!isDone && (
        <button
          type="submit"
          disabled={isLoading || isDone}
          className="bg-blue-500 rounded-full px-4 py-2 text-white"
        >
          {isLoading ? "Loading..." : updatePostId ? "Update" : "Create"}
        </button>
      )}
      {updatePostId && !isDone && (
        <button
          onClick={(e) => {
            e.preventDefault();
            handleDelete(updatePostId);
          }}
          disabled={isLoading || isDone}
          className="bg-red-500 rounded-full px-4 py-2 text-white"
        >
          {isLoading ? "Loading..." : "Delete"}
        </button>
      )}
      {isDone && (
        <h3 className="text-green-500 font-bold text-center">
          Successfully {updatePostId ? "Updated" : "Created"}!
        </h3>
      )}
    </>
  );
}

function SelectCategoryField() {
  const { data, handleData } = usePostForm();
  const { data: categories } = useCategories();
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm text-gray-500">
        Category <span className="text-red-500">*</span>
      </label>
      <select
        className="px-4 py-2 rounded-full border bg-gray-50"
        name="category"
        id="category"
        value={data?.categoryId}
        onChange={(e) => handleData("categoryId", e.target.value)}
        required
      >
        <option value="">Select Category</option>
        {categories &&
          categories.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
      </select>
    </div>
  );
}

function SelectAuthorField() {
  const { data, handleData } = usePostForm();
  const { data: authors } = useAuthors();
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm text-gray-500">
        Authors <span className="text-red-500">*</span>
      </label>
      <select
        className="px-4 py-2 rounded-full border bg-gray-50"
        name="authorId"
        id="authorId"
        value={data?.authorId}
        onChange={(e) => handleData("authorId", e.target.value)}
        required
      >
        <option value="">Select Author</option>
        {authors &&
          authors.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
      </select>
    </div>
  );
}
