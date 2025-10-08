
'use client';

import { useUser } from '@clerk/nextjs';
import PDFUploader from './PDFUploader';
import ALLpdf from './ALLpdf';
import { useState } from 'react';
export default function LoggedInContent() {
  const { user } = useUser();
  const [refreshFlag, setRefreshFlag] = useState(false);

  const handleUploadSuccess = () => {
    setRefreshFlag((prev) => !prev);
  }

  return (
    <div className="max-w-[1200px] mx-auto px-5 py-10">

      <PDFUploader onUploadSuccess={handleUploadSuccess} />
      <ALLpdf refreshFlag={refreshFlag} />

    </div>
  );
}