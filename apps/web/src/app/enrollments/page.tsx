"use client";

import { useState, useEffect, useCallback } from "react";
import type { Cadence, Enrollment } from "@cadence/shared";
import { createEnrollment, getCadences, getEnrollments } from "@/lib/api";
import { EnrollmentForm } from "@/components/EnrollmentForm";
import { EnrollmentList } from "@/components/EnrollmentList";

export default function EnrollmentsPage() {
  const [cadences, setCadences] = useState<Cadence[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);

  const loadData = useCallback(async () => {
    try {
      const [cads, enrs] = await Promise.all([getCadences(), getEnrollments()]);
      setCadences(cads);
      setEnrollments(enrs);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleEnroll = async (cadenceId: string, contactEmail: string) => {
    await createEnrollment({ cadenceId, contactEmail });
    await loadData();
  };

  return (
    <div>
      <h1>Enrollments</h1>

      <h2>Start New Enrollment</h2>
      <EnrollmentForm cadences={cadences} onEnroll={handleEnroll} />

      <h2>Existing Enrollments</h2>
      <EnrollmentList enrollments={enrollments} />
    </div>
  );
}
