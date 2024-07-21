"use client"

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useAuthorForm } from "./contexts/AuthorFormContext";

export default function Page() {
    const searchParams = useSearchParams();
    const updateAuthorId = searchParams.get('id')

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
    } = useAuthorForm();

    useEffect(() => {
        if (updateAuthorId) {
            fetchData(updateAuthorId);
        }
    }, [updateAuthorId])

    return (
        <main className="w-full min-h-screen p-4 md:p-6 flex flex-col gap-3 dark:bg-gray-900 dark:text-white ">
            <div className="flex flex-wrap gap-3 md:gap-5 items-center">
                {updateAuthorId && (
                    <div className="flex">
                        <h3 className="text-white bg-orange-500 px-3 md:px-4 py-1 md:py-2 rounded-full text-xs font-bold">Update</h3>
                    </div>
                )}
                {!updateAuthorId && (
                    <div className="flex">
                        <h3 className="text-white bg-green-500 px-3 md:px-4 py-1 md:py-2 rounded-full text-xs font-bold">Create</h3>
                    </div>
                )}
                <h1 className="font-bold">Author | Form</h1>
            </div>
            <section className="flex justify-center md:justify-start">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        if (updateAuthorId) {
                            handleUpdate();
                        } else {
                            handleCreate();
                        }
                    }}
                    className="flex flex-col gap-2 bg-blue-50 rounded-xl p-4 md:p-7 w-full max-w-md"
                >
                    <InputField
                        label="Author Name"
                        type="text"
                        value={data?.name}
                        onChange={(e) => handleData('name', e.target.value)}
                        required
                    />
                    <InputField
                        label="Author Email"
                        type="email"
                        value={data?.email}
                        onChange={(e) => handleData('email', e.target.value)}
                        required
                    />
                    <ImagePreview photoURL={data?.photoURL} image={image} />
                    <ImageUpload setImage={setImage} />
                    
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    
                    <FormButtons
                        isLoading={isLoading}
                        isDone={isDone}
                        updateAuthorId={updateAuthorId}
                        handleDelete={handleDelete}
                    />
                </form>
            </section>
        </main>
    )
}

function InputField({ label, type, value, onChange, required }) {
    return (
        <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-500">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <input
                className="px-4 py-2 rounded-full border bg-gray-50"
                placeholder={`Enter ${label}`}
                type={type}
                onChange={onChange}
                value={value}
                required={required}
            />
        </div>
    )
}

function ImagePreview({ photoURL, image }) {
    if (!photoURL && !image) return null;
    return (
        <div className="flex justify-center">
            <img className="h-40 object-cover" src={image ? URL.createObjectURL(image) : photoURL} alt="" />
        </div>
    )
}

function ImageUpload({ setImage }) {
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
    )
}

function FormButtons({ isLoading, isDone, updateAuthorId, handleDelete }) {
    if (isDone) {
        return (
            <h3 className="text-green-500 font-bold text-center">
                Successfully {updateAuthorId ? "Updated" : "Created"}!
            </h3>
        )
    }

    return (
        <div className="flex flex-col gap-2">
            <button
                type="submit"
                disabled={isLoading}
                className="bg-blue-500 rounded-full px-4 py-2 text-white"
            >
                {isLoading ? "Loading..." : updateAuthorId ? "Update" : "Create"}
            </button>
            {updateAuthorId && (
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        handleDelete(updateAuthorId);
                    }}
                    disabled={isLoading}
                    className="bg-red-500 rounded-full px-4 py-2 text-white"
                >
                    {isLoading ? "Loading..." : "Delete"}
                </button>
            )}
        </div>
    )
}