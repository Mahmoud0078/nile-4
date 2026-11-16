import type { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShieldCheck } from "lucide-react";

const SECTIONS: { title: string; body: string[] }[] = [
  {
    title: "١. البيانات اللي بنجمعها",
    body: [
      "بيانات الحساب: الاسم، رقم الموبايل، والبريد الإلكتروني (اختياري).",
      "بيانات الموقع: موقعك الحالي ومكان الوصول، وبنستخدمها فقط لتشغيل خدمة الرحلات.",
      "بيانات الاستخدام: الرحلات السابقة، التقييمات، وسجل المدفوعات داخل المحفظة.",
    ],
  },
  {
    title: "٢. إزاي بنستخدم بياناتك",
    body: [
      "لتشغيل الخدمة: ربطك بأقرب سائق وحساب سعر الرحلة.",
      "لتحسين التجربة: تحليل أنماط الاستخدام لتطوير المميزات.",
      "للأمان: منع الاحتيال والتحقق من هوية المستخدمين.",
      "للدعم: الرد على استفساراتك وحل المشاكل الفنية.",
    ],
  },
  {
    title: "٣. مشاركة البيانات",
    body: [
      "بنشارك الحد الأدنى من البيانات مع السائق لإتمام الرحلة (الاسم ومكان الالتقاء).",
      "بنستخدم مزودي خدمات دفع لتأمين المعاملات، وملتزمين بعدم مشاركة بياناتك مع أي طرف تالت لأغراض تسويقية بدون موافقتك.",
      "قد نكشف عن البيانات لو طُلب مننا قانونياً من جهة مختصة.",
    ],
  },
  {
    title: "٤. أمان البيانات",
    body: [
      "بنستخدم تشفير SSL/TLS لكل البيانات المنقولة، وتشفير كلمات المرور قبل تخزينها.",
      "الوصول للبيانات مقصور على الموظفين المصرح لهم فقط.",
      "بنحتفظ ببياناتك للمدة اللازمة لتقديم الخدمة أو حسب ما يقتضيه القانون.",
    ],
  },
  {
    title: "٥. حقوقك",
    body: [
      "حق الوصول: تقدر تطلب نسخة من بياناتك المخزنة عندنا.",
      "حق التصحيح: تقدر تعدّل بياناتك من إعدادات الحساب في أي وقت.",
      "حق الحذف: تقدر تطلب حذف حسابك وبياناتك، وهنستجيب خلال ٣٠ يوم.",
      "حق الاعتراض: تقدر ترفض استخدام بياناتك في أغراض تسويقية.",
    ],
  },
  {
    title: "٦. ملفات تعريف الارتباط (Cookies)",
    body: [
      "بنستخدم ملفات تعريف الارتباط لتذكر تسجيل دخولك وتحسين أداء التطبيق.",
      "تقدر تتحكم في إعدادات الكوكيز من متصفحك، لكن ده قد يؤثر على بعض المميزات.",
    ],
  },
  {
    title: "٧. التواصل معنا",
    body: [
      "لأي استفسار بخصوص الخصوصية، تواصل معنا على: privacy@rehlti.app",
      "أو من خلال قسم الدعم الفني داخل التطبيق.",
    ],
  },
];

export function PrivacyDialog({ children }: { children: ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl rounded-2xl border-slate-200 p-0">
        <DialogHeader className="border-b border-slate-100 bg-gradient-to-br from-slate-800 to-slate-900 px-6 py-5 text-white">
          <DialogTitle className="flex items-center gap-2 font-serif text-xl font-bold">
            <ShieldCheck className="size-5 text-emerald-400" /> سياسة الخصوصية
          </DialogTitle>
          <DialogDescription className="text-slate-300">
            آخر تحديث: ١ يناير ٢٠٢٥ — خصوصيتك أولوية عندنا.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-96 px-6 py-5">
          <div className="space-y-6">
            {SECTIONS.map((s) => (
              <section key={s.title}>
                <h3 className="font-semibold text-slate-800">{s.title}</h3>
                <div className="mt-2 space-y-2">
                  {s.body.map((p) => (
                    <p key={p} className="text-sm leading-relaxed text-slate-600">
                      {p}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </ScrollArea>

        <div className="border-t border-slate-100 bg-slate-50 px-6 py-4 text-xs text-muted-foreground">
          باستخدامك التطبيق، إنت بتوافق على جمع واستخدام بياناتك زي ما هو موضح فوق.
        </div>
      </DialogContent>
    </Dialog>
  );
}