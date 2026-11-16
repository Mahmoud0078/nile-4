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
import { FileText } from "lucide-react";

const SECTIONS: { title: string; body: string[] }[] = [
  {
    title: "١. قبول الشروط",
    body: [
      "باستخدامك تطبيق «رحلتي» أو إنشاء حساب عليه، فإنك توافق على الالتزام بهذه الشروط. لو مش موافق، من فضلك متستخدمش التطبيق.",
      "بنحتفظ بحقنا في تحديث الشروط في أي وقت، واستخدامك المستمر للتطبيق بعد التحديث يعتبر موافقة على النسخة الجديدة.",
    ],
  },
  {
    title: "٢. الأهلية والحساب",
    body: [
      "لازم تكون ١٨ سنة على الأقل، أو تستخدم التطبيق تحت إشراف ولي أمر.",
      "أنت مسؤول عن صحة البيانات اللي بتسجلها، وعن الحفاظ على سرية كلمة المرور الخاصة بحسابك.",
      "أي استخدام غير مصرح به لحسابك لازم تبلغنا عنه فوراً.",
    ],
  },
  {
    title: "٣. استخدام الخدمة",
    body: [
      "التطبيق بيوفر خدمات حجز رحلات وربط بين العملاء والسائقين. إحنا وسيط تقني ومش طرف في العقد بينك وبين السائق.",
      "ممنوع استخدام التطبيق في أي نشاط غير قانوني، أو إزعاج السائقين، أو تقديم بيانات مضللة.",
      "بنحتفظ بحقنا في إيقاف أو حذف أي حساب يخالف الشروط بدون إشعار مسبق.",
    ],
  },
  {
    title: "٤. الأسعار والدفع",
    body: [
      "الأسعار المعروضة تقديرية وبتتأثر بالمسافة والزمن والطلب. السعر النهائي بيظهر قبل تأكيد الرحلة.",
      "المدفوعات بتتم من خلال المحفظة الإلكترونية أو وسائل الدفع المتاحة داخل التطبيق.",
      "أكواد الخصم غير قابلة للاستبدال نقداً، وبنحتفظ بحق إلغاء أي كود في حالة إساءة الاستخدام.",
    ],
  },
  {
    title: "٥. الإلغاء والاسترداد",
    body: [
      "تقدر تلغي الرحلة قبل وصول السائق بدون رسوم. بعد وصول السائق قد يتم تطبيق رسوم إلغاء.",
      "في حالة وجود مشكلة في الرحلة، لازم تبلغ الدعم الفني خلال ٤٨ ساعة من انتهاء الرحلة.",
    ],
  },
  {
    title: "٦. حدود المسؤولية",
    body: [
      "بنبذل جهدنا لتوفير خدمة مستقرة، لكن مش بنضمن إن الخدمة هتكون متاحة بدون انقطاع أو أخطاء.",
      "مسؤوليتنا محدودة بقيمة الرحلة محل النزاع، ولا نتحمل أي أضرار غير مباشرة.",
    ],
  },
  {
    title: "٧. القانون الواجب التطبيق",
    body: [
      "هذه الشروط محكومة بقوانين جمهورية مصر العربية، وأي نزاع يتم حله أمام المحاكم المختصة بالقاهرة.",
    ],
  },
];

export function TermsDialog({ children }: { children: ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl rounded-2xl border-slate-200 p-0">
        <DialogHeader className="border-b border-slate-100 bg-gradient-to-br from-emerald-600 to-teal-700 px-6 py-5 text-white">
          <DialogTitle className="flex items-center gap-2 font-serif text-xl font-bold">
            <FileText className="size-5" /> شروط الاستخدام
          </DialogTitle>
          <DialogDescription className="text-emerald-100/90">
            آخر تحديث: ١ يناير ٢٠٢٥ — من فضلك اقرأ الشروط بعناية.
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
          باستخدامك التطبيق، إنت بتقر إنك قرأت وفهمت ووافقت على الشروط دي.
        </div>
      </DialogContent>
    </Dialog>
  );
}