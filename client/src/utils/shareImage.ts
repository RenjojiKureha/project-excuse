import html2canvas from 'html2canvas';

export async function captureElement(el: HTMLElement): Promise<Blob> {
  const canvas = await html2canvas(el, {
    scale: 2,
    useCORS: true,
    backgroundColor: null,
  });

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('Failed to create blob'));
    }, 'image/png');
  });
}

export async function shareImage(blob: Blob, title: string): Promise<void> {
  const file = new File([blob], 'excuse.png', { type: 'image/png' });

  if (navigator.share && navigator.canShare?.({ files: [file] })) {
    await navigator.share({ title, files: [file] });
  } else {
    // 降级：下载图片
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'excuse.png';
    link.click();
    URL.revokeObjectURL(url);
  }
}
