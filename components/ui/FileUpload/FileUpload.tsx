"use client";

import * as React from "react";
import { useDropzone, type Accept, type FileRejection } from "react-dropzone";
import { FileIcon, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/libs/cn";

export type FileUploadProps = {
  value?: File | null;
  onChange?: (file: File | null) => void;
  accept?: Accept;
  maxSize?: number;
  disabled?: boolean;
  previewUrl?: string | null;
  className?: string;
  placeholder?: string;
  hint?: string;
};

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function FileUpload({
  value = null,
  onChange,
  accept = { "image/*": [] },
  maxSize = 5 * 1024 * 1024,
  disabled = false,
  previewUrl,
  className,
  placeholder = "Seret file ke sini, atau klik untuk pilih",
  hint,
}: FileUploadProps) {
  const [error, setError] = React.useState<string | null>(null);
  const localPreview = React.useMemo(() => {
    if (!value) return null;
    return URL.createObjectURL(value);
  }, [value]);

  React.useEffect(() => {
    return () => {
      if (localPreview) URL.revokeObjectURL(localPreview);
    };
  }, [localPreview]);

  const onDrop = React.useCallback(
    (accepted: File[], rejected: FileRejection[]) => {
      setError(null);
      if (rejected.length > 0) {
        const first = rejected[0];
        const code = first?.errors[0]?.code;
        if (code === "file-too-large") {
          setError(`File terlalu besar (max ${formatBytes(maxSize)})`);
        } else if (code === "file-invalid-type") {
          setError("Tipe file tidak didukung");
        } else {
          setError(first?.errors[0]?.message ?? "Gagal memilih file");
        }
        return;
      }
      onChange?.(accepted[0] ?? null);
    },
    [maxSize, onChange],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    maxFiles: 1,
    multiple: false,
    disabled,
  });

  const displayPreview = localPreview || previewUrl || null;

  return (
    <div className={cn("space-y-2", className)}>
      <div
        {...getRootProps()}
        className={cn(
          "border-border bg-background flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-8 text-center transition-colors",
          isDragActive && "border-primary bg-primary/5",
          disabled && "cursor-not-allowed opacity-50",
          error && "border-destructive",
        )}
      >
        <input {...getInputProps()} />
        <div className="bg-muted flex size-10 items-center justify-center rounded-full">
          <Upload className="text-muted-foreground size-5" />
        </div>
        <p className="text-sm font-medium">{placeholder}</p>
        {hint ? (
          <p className="text-muted-foreground text-xs">{hint}</p>
        ) : (
          <p className="text-muted-foreground text-xs">
            Max {formatBytes(maxSize)}
          </p>
        )}
      </div>

      {value || displayPreview ? (
        <div className="border-border flex items-center gap-3 rounded-xl border-2 p-3">
          {displayPreview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={displayPreview}
              alt="Preview"
              className="size-12 rounded-lg object-cover"
            />
          ) : (
            <div className="bg-muted flex size-12 items-center justify-center rounded-lg">
              <FileIcon className="size-5" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">
              {value?.name ?? "File terpilih"}
            </p>
            {value ? (
              <p className="text-muted-foreground text-xs">
                {formatBytes(value.size)}
              </p>
            ) : null}
          </div>
          {!disabled ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              aria-label="Hapus file"
              onClick={(e) => {
                e.stopPropagation();
                setError(null);
                onChange?.(null);
              }}
            >
              <X className="size-4" />
            </Button>
          ) : null}
        </div>
      ) : null}

      {error ? <p className="text-destructive text-sm">{error}</p> : null}
    </div>
  );
}
