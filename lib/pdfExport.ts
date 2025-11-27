import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';

export async function exportToPDF(
  element: HTMLElement,
  fileName: string,
  title: string
): Promise<void> {
  try {
    // Show loading state (handled by component)

    // Wait a bit for any animations to complete
    await new Promise(resolve => setTimeout(resolve, 500));

    // Capture the element as PNG image
    const dataUrl = await toPng(element, {
      cacheBust: true,
      pixelRatio: 2, // Higher quality (2x resolution)
      backgroundColor: '#ffffff',
      width: element.scrollWidth,
      height: element.scrollHeight,
      style: {
        transform: 'scale(1)',
        transformOrigin: 'top left',
      },
    });

    // Create an image to get dimensions
    const img = new Image();
    img.src = dataUrl;
    await new Promise((resolve) => {
      img.onload = resolve;
    });

    // Calculate PDF dimensions
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (img.height * imgWidth) / img.width;

    // Create PDF
    const pdf = new jsPDF({
      orientation: imgHeight > pageHeight ? 'portrait' : 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    // Add title page
    pdf.setFontSize(24);
    pdf.setTextColor(79, 70, 229); // Indigo color
    pdf.text(title, 105, 30, { align: 'center' });

    pdf.setFontSize(12);
    pdf.setTextColor(100, 116, 139); // Slate color
    const currentDate = new Date().toLocaleString('en-IN', {
      dateStyle: 'full',
      timeStyle: 'short',
    });
    pdf.text(`Generated on: ${currentDate}`, 105, 45, { align: 'center' });

    pdf.setFontSize(10);
    pdf.setTextColor(148, 163, 184);
    pdf.text('India Trade Analysis Platform', 105, 55, { align: 'center' });
    pdf.text('Powered by Google Gemini AI', 105, 62, { align: 'center' });

    // Add content starting from second page
    let heightLeft = imgHeight;
    let position = 20; // Start position on new page

    // Add new page for content
    pdf.addPage();

    // Use the captured image data URL directly
    const imgData = dataUrl;

    // Add image to PDF
    if (heightLeft <= pageHeight - 30) {
      // Single page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    } else {
      // Multiple pages
      let currentPosition = 0;

      while (heightLeft > 0) {
        if (currentPosition > 0) {
          pdf.addPage();
        }

        pdf.addImage(
          imgData,
          'PNG',
          0,
          position - currentPosition,
          imgWidth,
          imgHeight
        );

        heightLeft -= pageHeight - 30;
        currentPosition += pageHeight - 30;
      }
    }

    // Add footer to all pages
    const totalPages = pdf.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      pdf.setFontSize(8);
      pdf.setTextColor(148, 163, 184);
      pdf.text(
        `Page ${i} of ${totalPages}`,
        105,
        287,
        { align: 'center' }
      );
    }

    // Save the PDF
    pdf.save(fileName);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF');
  }
}

export function generateFileName(view: 'historical' | 'predictions'): string {
  const date = new Date().toISOString().split('T')[0];
  const viewName = view === 'historical' ? 'Historical-Analysis' : 'AI-Predictions';
  return `India-Trade-${viewName}-${date}.pdf`;
}

export function generatePDFTitle(view: 'historical' | 'predictions'): string {
  return view === 'historical'
    ? 'India Trade Analysis - Historical Report'
    : 'India Trade Analysis - AI Predictions Report';
}
