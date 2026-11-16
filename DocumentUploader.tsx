import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { hapticTap } from "@/lib/platform";
import {
  DOC_SPECS,
  MAX_FILE_MB,
  readFileAsDataUrl,
  validateImage,
  type DocKey,
  type DocMap,
} from "@/lib/documents";
import {
  CheckCircle2,
  ImagePlus,
  RefreshCw,
  Trash2,
  UploadCloud,
} from "lucide-react";

export function DocumentUploader({
  docs,
  onChange,
}: {
  docs: DocMap;
  onChange: (docs: DocMap) => void;
}) {
  const [busyKey, setBusyKey] = useState<DocKey | null>(null);
  const [errorKey, setErrorKey] = useState<DocKey | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const inputs = useRef<Partial<Record<DocKey, HTMLInputElement | null>>>({});

  async function handleFile(key: DocKey, file: File | undefined) {
    if (!file) return;
    const problem = validateImage(file);
    if (problem) {
      setErrorKey(key);
      setErrorMsg(problem);
      return;
    }
    setErrorKey(null);
    setBusyKey(key);
    try {
      const dataUrl = await readFileAsDataUrl(file);
      onChange({
        ...docs,
        [key]: {
          key,
          fileName: file.name,
          dataUrl,
          sizeKb: Math.max(1, Math.round(file.size / 1024)),
          uploadedAt: Date.now(),
        },
      });
      hapticTap();
    } catch {
      setErrorKey(key);
      setErrorMsg("تعذّر قراءة الصورة، حاول مرة أخرى");
    } finally {
      setBusyKey(null);
    }
  }

  function remove(key: DocKey) {
    const next = { ...docs };
    delete next[key];
    onChange(next);
    hapticTap();
  }

  return (
    <div className="space-y-3">
      {DOC_SPECS.map((spec) => {
        const doc = docs[spec.key];
        const busy = busyKey === spec.key;
        const hasError = errorKey === spec.key;

        return (
          <div
            key={spec.key}
            className={cn(
              "rounded-2xl border p-3 transition",
              doc
                ? "border-teal-200 bg-teal-50"
                : hasError
                  ? "border-rose-200 bg-rose-50"
                  : "border-slate-200 bg-white",
            )}
          >
            <div className="flex items-start gap-3">
              <div
                className={cn(
                  "relative h-16 w-20 shrink-0 overflow-hidden rounded-xl border",
                  doc ? "border-teal-300 bg-white" : "border-slate-200 bg-slate-50",
                )}
              >
                {doc ? (
                  <img
                    src={doc.dataUrl}
                    alt={spec.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <ImagePlus className="h-5 w-5 text-slate-300" />
                  </div>
                )}
                {busy ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/70">
                    <RefreshCw className="h-4 w-4 animate-spin text-teal-600" />
                  </div>
                ) : null}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="truncate text-xs font-bold text-slate-900">
                    {spec.title}
                  </p>
                  {doc ? (
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-teal-600" />
                  ) : null}
                </div>
                <p className="mt-0.5 text-[10px] font-medium leading-relaxed text-slate-500">
                  {doc ? `${doc.fileName} · ${doc.sizeKb} ك.ب` : spec.subtitle}
                </p>

                <div className="mt-2 flex items-center gap-2">
                  <input
                    ref={(el) => {
                      inputs.current[spec.key] = el;
                    }}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      void handleFile(spec.key, e.target.files?.[0]);
                      e.target.value = "";
                    }}
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant={doc ? "outline" : "default"}
                    className={cn(
                      "h-8 rounded-xl text-[10px] font-bold",
                      doc
                        ? "border-teal-300 bg-white text-teal-700 hover:bg-teal-100"
                        : "bg-teal-600 text-white hover:bg-teal-700",
                    )}
                    onClick={() => inputs.current[spec.key]?.click()}
                  >
                    <UploadCloud className="me-1 h-3.5 w-3.5" />
                    {doc ? "استبدال" : "رفع صورة"}
                  </Button>
                  {doc ? (
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="h-8 rounded-xl text-[10px] font-bold text-rose-600 hover:bg-rose-50"
                      onClick={() => remove(spec.key)}
                    >
                      <Trash2 className="me-1 h-3.5 w-3.5" />
                      حذف
                    </Button>
                  ) : null}
                </div>

                {hasError ? (
                  <p className="mt-1.5 text-[10px] font-bold text-rose-600">
                    {errorMsg}
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        );
      })}

      <p className="text-[10px] font-medium leading-relaxed text-slate-400">
        الصيغ المدعومة: JPG / PNG · الحد الأقصى {MAX_FILE_MB} ميجابايت للصورة.
        تأكد أن الصورة واضحة وبها كل البيانات.
      </p>
    </div>
  );
}

export default DocumentUploader;