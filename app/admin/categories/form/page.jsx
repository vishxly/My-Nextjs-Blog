"use client"

import { useSearchParams } from "next/navigation";
import { useCategoryForm } from "./contexts/CategoryFormContext";
import { useEffect } from "react";

export default function Page() {
    const searchParams = useSearchParams();
    const updateCategoryId = searchParams.get('id')

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
    } = useCategoryForm();

    useEffect(() => {
        if (updateCategoryId) {
            fetchData(updateCategoryId);
        }
    }, [updateCategoryId])

    return (
        <main className="flex flex-col w-full min-h-screen gap-3 p-4 md:p-6 dark:bg-black dark:text-white ">
            <div className="flex flex-wrap items-center gap-3 md:gap-5">
                {updateCategoryId && (
                    <div className="flex">
                        <h3 className="px-3 py-1 text-xs font-bold text-white bg-orange-500 rounded-full md:px-4 md:py-2">Update</h3>
                    </div>
                )}
                {!updateCategoryId && (
                    <div className="flex">
                        <h3 className="px-3 py-1 text-xs font-bold text-white bg-green-500 rounded-full md:px-4 md:py-2">Create</h3>
                    </div>
                )}
                <h1 className="font-bold">Category | Form</h1>
            </div>
            <section className="flex justify-center md:justify-start">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        if (updateCategoryId) {
                            handleUpdate();
                        } else {
                            handleCreate();
                        }
                    }}
                    className="flex flex-col w-full max-w-md gap-2 p-4 bg-blue-50 rounded-xl md:p-7"
                >
                    <InputField 
                        label="Category Name" 
                        value={data?.name} 
                        onChange={(e) => handleData('name', e.target.value)} 
                        required 
                    />
                    <InputField 
                        label="Category Slug" 
                        value={data?.slug} 
                        onChange={(e) => handleData('slug', e.target.value)} 
                        required 
                    />
                    <ImagePreview imageURL={data?.iconURL} image={image} />
                    <ImageUpload setImage={setImage} />
                    
                    {error && <p className="text-sm text-red-500">{error}</p>}
                    
                    <FormButtons 
                        isLoading={isLoading} 
                        isDone={isDone} 
                        updateCategoryId={updateCategoryId} 
                        handleDelete={handleDelete} 
                    />
                </form>
            </section>
        </main>
    )
}

function InputField({ label, value, onChange, required }) {
    return (
        <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-500">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <input
                className="px-4 py-2 border rounded-full bg-gray-50"
                placeholder={`Enter ${label}`}
                type="text"
                onChange={onChange}
                value={value}
                required={required}
            />
        </div>
    )
}

function ImagePreview({ imageURL, image }) {
    if (!imageURL && !image) return null;
    return (
        <div className="flex justify-center">
            <img className="object-cover h-40" src={image ? URL.createObjectURL(image) : imageURL} alt="" />
        </div>
    )
}

function ImageUpload({ setImage }) {
    return (
        <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-500">Image</label>
            <input
                className="px-4 py-2 border rounded-full bg-gray-50"
                type="file"
                accept="image/*"
                onChange={(e) => {
                    e.preventDefault();
                    setImage(e.target.files[0]);
                }}
            />
        </div>
    )
}

function FormButtons({ isLoading, isDone, updateCategoryId, handleDelete }) {
    if (isDone) {
        return (
            <h3 className="font-bold text-center text-green-500">
                Successfully {updateCategoryId ? "Updated" : "Created"}!
            </h3>
        )
    }

    return (
        <div className="flex flex-col gap-2">
            <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 text-white bg-blue-500 rounded-full"
            >
                {isLoading ? "Loading..." : updateCategoryId ? "Update" : "Create"}
            </button>
            {updateCategoryId && (
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        handleDelete(updateCategoryId);
                    }}
                    disabled={isLoading}
                    className="px-4 py-2 text-white bg-red-500 rounded-full"
                >
                    {isLoading ? "Loading..." : "Delete"}
                </button>
            )}
        </div>
    )
}
