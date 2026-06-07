"use client";

import { useState } from "react";
import { Loader2, Search } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";

export default function UnsplashImagePicker({ isOpen, onClose, onSelect }) {
  const [query, setQuery] = useState("");
  const [images, setImages] = useState([]);
  const [isloading, setIsLoading] = useState(false);

  async function searchImages(searchQuery) {
    setIsLoading(true);

    try {
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${searchQuery}&per_page=12&client_id=${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}`,
      );
      const data = await response.json();
      setImages(data.results || []);
    } catch (error) {
      console.error("Error Fetching Images:", error);
    } finally {
      setIsLoading(false);
    }
  }

  function handleSearchImages(e) {
    e.preventDefault();
    searchImages(query);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle>Choose Cover Image</DialogTitle>
        </DialogHeader>

        <form className="flex gap-2" onSubmit={handleSearchImages}>
          <Input
            value={query}
            placeholder="Search for Images..."
            className="flex-1"
            onChange={(e) => setQuery(e.target.value)}
          />

          <Button type="submit" disabled={isloading}>
            {isloading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
          </Button>
        </form>

        <div className="flex-1 overflow-y-auto px-6 -mx-6">
          {isloading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4 py-4">
              {images.map((image) => (
                <button
                  key={image.id}
                  className="relative aspect-video border-2 border-transparent rounded-lg overflow-hidden transition-all hover:border-purple-500"
                  onClick={() => onSelect(image.urls.regular)}
                >
                  <Image
                    src={image.urls.small}
                    alt={image.description || "Unsplash Image"}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </button>
              ))}
            </div>
          )}

          {!isloading && images.length === 0 && (
            <div className="text-muted-foreground text-center py-12">
              Search for Images to get Started
            </div>
          )}
        </div>

        <p className="text-muted-foreground text-xs">
          Photos from{" "}
          <Link
            href="https://unsplash.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            Unsplash
          </Link>
        </p>
      </DialogContent>
    </Dialog>
  );
}
