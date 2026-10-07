import React from 'react';
import { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import { CustomerTrainingFormData } from '../../schemas/customerTrainingSchema';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Plane, Compass, Calendar, Layers } from 'lucide-react';

interface CourseOrderSectionProps {
  register: UseFormRegister<CustomerTrainingFormData>;
  errors: FieldErrors<CustomerTrainingFormData>;
  watch: UseFormWatch<CustomerTrainingFormData>;
  setValue: UseFormSetValue<CustomerTrainingFormData>;
}

const COURSES = [
  'PPL',
  'CPL/IR Integrated + ATP',
  'IR',
  'ME',
  'ATP',
  'Conversion TCAR',
  'Recurrent',
  'Type Rating',
  'Other',
];

const TRAINING_COMPONENTS = [
  'Ground',
  'Flight',
  'Simulator',
  'CAAT Exam',
  'Skill Test',
  'ICAO ELP',
];

export const CourseOrderSection: React.FC<CourseOrderSectionProps> = ({
  register,
  errors,
  watch,
  setValue,
}) => {
  const currentCourses = watch('courseOrder.courses') || [];
  const trainingComponents = watch('courseOrder.trainingComponents') || [];

  const toggleCourse = (course: string) => {
    if (currentCourses.includes(course)) {
      setValue(
        'courseOrder.courses',
        currentCourses.filter((c) => c !== course),
        { shouldValidate: true }
      );
    } else {
      setValue('courseOrder.courses', [...currentCourses, course], { shouldValidate: true });
    }
  };

  const toggleComponent = (comp: string) => {
    if (trainingComponents.includes(comp)) {
      setValue(
        'courseOrder.trainingComponents',
        trainingComponents.filter((item) => item !== comp),
        { shouldValidate: true }
      );
    } else {
      setValue('courseOrder.trainingComponents', [...trainingComponents, comp], { shouldValidate: true });
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-3">
        <h3 className="text-base font-bold text-blue-950 flex items-center gap-2">
          <Plane className="w-5 h-5 text-blue-800" />
          SECTION E – COURSE ORDER DETAILS (for Sales / Operation / Standard)
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Aviation curriculum specifications, flight syllabus components, and schedule planning
        </p>
      </div>

      {/* COURSE ORDERED CHECKBOXES */}
      <div className="bg-slate-50/70 p-4.5 rounded-xl border border-slate-200 space-y-3">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            Course ordered (หลักสูตรการบินที่ลงทะเบียน) <span className="text-red-500">*</span>
          </label>
          <span className="text-[11px] text-slate-500 font-medium">
            {currentCourses.length} selected
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
          {COURSES.map((course) => {
            const isChecked = currentCourses.includes(course);
            return (
              <div
                key={course}
                onClick={() => toggleCourse(course)}
                className={`flex items-center gap-2 p-3 rounded-lg border text-xs sm:text-sm font-medium transition cursor-pointer select-none ${
                  isChecked
                    ? 'border-blue-900 bg-blue-50/90 text-blue-950 font-bold shadow-2xs'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleCourse(course)}
                  className="w-4 h-4 rounded text-blue-900 border-slate-300 pointer-events-none accent-blue-900"
                />
                <span className="leading-snug">{course}</span>
              </div>
            );
          })}
        </div>

        {errors.courseOrder?.courses && (
          <p className="text-xs text-red-600 font-medium pt-1">
            {errors.courseOrder.courses.message}
          </p>
        )}

        {currentCourses.includes('Other') && (
          <div className="pt-2 animate-in fade-in">
            <Input
              label="Other Course (ระบุหลักสูตรอื่น)"
              placeholder="e.g. Flight Instructor (FI) / Tailwheel Transition"
              {...register('courseOrder.otherCourse')}
            />
          </div>
        )}
      </div>

      {/* AIRCRAFT TYPE, PACKAGE, START DATE, DURATION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Aircraft Type (แบบอากาศยาน)"
          placeholder="e.g. Cessna 172SP / Diamond DA42"
          leftIcon={<Plane className="w-4 h-4" />}
          {...register('courseOrder.aircraftType')}
        />

        <Input
          label="Package (แพ็กเกจ)"
          placeholder="e.g. Standard Commercial Cadet Package / Fast-track"
          leftIcon={<Layers className="w-4 h-4" />}
          {...register('courseOrder.package')}
        />

        <Input
          label="Preferred start (วันที่เริ่มเรียนที่ต้องการ)"
          requiredStar
          type="date"
          leftIcon={<Calendar className="w-4 h-4" />}
          {...register('courseOrder.preferredStart')}
          error={errors.courseOrder?.preferredStart?.message}
        />

        <Input
          label="Est. duration (ระยะเวลาเรียนโดยประมาณ)"
          placeholder="e.g. 12-14 Months / 60 Days"
          {...register('courseOrder.estimatedDuration')}
        />
      </div>

      {/* TRAINING COMPONENTS CHECKBOXES */}
      <div className="bg-slate-50/70 p-4.5 rounded-xl border border-slate-200 space-y-3">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          <Compass className="w-4 h-4 text-blue-800" /> Training components (องค์ประกอบการฝึกอบรม):
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
          {TRAINING_COMPONENTS.map((comp) => {
            const isChecked = trainingComponents.includes(comp);
            return (
              <div
                key={comp}
                onClick={() => toggleComponent(comp)}
                className={`flex items-center gap-2 p-2.5 rounded-lg border text-xs font-medium transition cursor-pointer select-none ${
                  isChecked
                    ? 'border-blue-900 bg-blue-50/90 text-blue-950 font-bold'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleComponent(comp)}
                  className="w-4 h-4 rounded text-blue-900 border-slate-300 pointer-events-none accent-blue-900"
                />
                <span>{comp}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* SPECIAL REQUIREMENTS / NOTES */}
      <Textarea
        label="Special requirements / notes (ข้อกำหนดพิเศษ / บันทึกเพิ่มเติม)"
        rows={3}
        placeholder="e.g. Special simulator flight scheduling, English language tutoring, accelerated ground school..."
        {...register('courseOrder.specialRequirements')}
      />
    </div>
  );
};
