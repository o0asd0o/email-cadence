"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import { getEnrollment, updateEnrollmentCadence } from "@/lib/api";
import type { EnrollmentWithState } from "@/lib/api";
import { EnrollmentInfo } from "@/components/EnrollmentInfo";
import { StepProgress } from "@/components/StepProgress";
import { UpdateCadenceForm } from "@/components/UpdateCadenceForm";

export default function EnrollmentDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [enrollment, setEnrollment] = useState<EnrollmentWithState | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [initialSteps, setInitialSteps] = useState("");
  const stepsInitialized = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const loadEnrollment = useCallback(async () => {
    try {
      const data = await getEnrollment(id);
      setEnrollment(data);

      if (!stepsInitialized.current && data.workflowState?.steps) {
        setInitialSteps(JSON.stringify(data.workflowState.steps, null, 2));
        stepsInitialized.current = true;
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadEnrollment();

    intervalRef.current = setInterval(loadEnrollment, 2000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [loadEnrollment]);

  const handleUpdateCadence = async (stepsJson: string) => {
    const steps = JSON.parse(stepsJson);
    await updateEnrollmentCadence(id, { steps });
    await loadEnrollment();
  };

  if (loading) return <p>Loading...</p>;
  if (!enrollment) return <p>Enrollment not found.</p>;

  const ws = enrollment.workflowState;

  return (
    <div>
      <h1>Enrollment: {enrollment.id}</h1>

      <EnrollmentInfo enrollment={enrollment} workflowState={ws} />

      <h2>Current Steps</h2>
      <StepProgress
        steps={ws?.steps ?? []}
        currentStepIndex={ws?.currentStepIndex ?? 0}
        status={ws?.status ?? "UNKNOWN"}
      />

      <h2>Update Running Cadence</h2>
      {initialSteps && (
        <UpdateCadenceForm
          initialSteps={initialSteps}
          onUpdate={handleUpdateCadence}
        />
      )}

      <a href="/enrollments">
        <button type="button">Back</button>
      </a>
    </div>
  );
}
