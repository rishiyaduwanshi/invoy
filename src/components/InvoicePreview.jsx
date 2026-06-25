import React, { Suspense } from 'react';

// Lazy load templates for performance optimization
const Templates = {
  classic: React.lazy(() => import('../templates/classic')),
  modern: React.lazy(() => import('../templates/modern')),
  minimalist: React.lazy(() => import('../templates/minimalist')),
  creative: React.lazy(() => import('../templates/creative')),
  corporate: React.lazy(() => import('../templates/corporate')),
  elegant: React.lazy(() => import('../templates/elegant')),
};

export default function InvoicePreview({ template, data }) {
  // Fallback to classic if the template string is invalid or undefined
  const TemplateComponent = Templates[template] || Templates.classic;

  return (
    <Suspense fallback={
      <div style={{ backgroundColor: '#fff', color: '#6b7280', padding: 40, minHeight: 1056, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Loading template...</p>
      </div>
    }>
      <TemplateComponent data={data} />
    </Suspense>
  );
}
