export type DocKey =
  | "idFront"
  | "idBack"
  | "vehicleFront"
  | "vehicleBack"
  | "license";

export type DocSpec = {
  key: DocKey;
  title: string;
  subtitle: string;
  required: boolean;
};

export const DOC_SPECS: DocSpec[] = [
  {
    key: "idFront",
    title: "البطاقة الشخصية — أمامي",
    subtitle: "الوجه الذي يحمل الصورة والرقم القومي",
    required: true,
  },
  {
    key: "idBack",
    title: "البطاقة الشخصية — خلفي",
    subtitle: "الوجه الذي يحمل العنوان والرقم القومي",
    required: true,
  },
  {
    key: "vehicleFront",
    title: "رخصة المركبة — أمامي",
    subtitle: "بيانات المركبة ورقم اللوحة",
    required: true,
  },
  {
    key: "vehicleBack",
    title: "رخصة المركبة — خلفي",
    subtitle: "الوجه الخلفي لرخصة المركبة",
    required: true,
  },
  {
    key: "license",
    title: "الرخصة الشخصية للكابتن",
    subtitle: "رخصة القيادة الخاصة بك",
    required: true,
  },
];

export type UploadedDoc = {
  key: DocKey;
  fileName: string;
  dataUrl: string;
  sizeKb: number;
  uploadedAt: number;
};

export type DocMap = Partial<Record<DocKey, UploadedDoc>>;

export const MAX_FILE_MB = 5;

export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("read-failed"));
    reader.readAsDataURL(file);
  });
}

export function validateImage(file: File): string | null {
  if (!file.type.startsWith("image/")) {
    return "الملف يجب أن يكون صورة (JPG أو PNG)";
  }
  if (file.size > MAX_FILE_MB * 1024 * 1024) {
    return `حجم الصورة أكبر من ${MAX_FILE_MB} ميجابايت`;
  }
  return null;
}

export function missingDocs(docs: DocMap): DocSpec[] {
  return DOC_SPECS.filter((spec) => spec.required && !docs[spec.key]);
}

export function docsProgress(docs: DocMap): number {
  const done = DOC_SPECS.filter((spec) => docs[spec.key]).length;
  return Math.round((done / DOC_SPECS.length) * 100);
}