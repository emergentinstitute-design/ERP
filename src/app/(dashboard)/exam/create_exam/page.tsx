import { BookOpen } from "lucide-react";
import CreateExamForm from "./form";
import CreatedExamsList from "./CreatedExamsList";

export default function CreateExamPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
          <BookOpen className="h-6 w-6 text-indigo-600" />
          Create Exam
        </h1>

        <p className="text-slate-500 text-sm mt-1">
          Create a new exam and assign it to a batch.
        </p>
      </div>

      <div className="space-y-8">
        <CreateExamForm />
        <CreatedExamsList />
      </div>
    </div>
  );
}