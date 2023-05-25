import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  private apiUrl = 'http://localhost:3000/api/files/pdf';
  iframeSrc: SafeResourceUrl | null = null;
  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {}

  public generatePdf(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data, {
      responseType: 'blob',
    });
  }

  uploadFile(file: File, path: string): Observable<any> {
    const formData = new FormData();
    formData.append('pdf', file, file.name);
    const options = { params: { path } };
    return this.http.post(this.apiUrl, formData, options);
  }
  previewPDF(data: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const options = { headers, responseType: 'blob' as 'json' };

    return this.http
      .post<Blob>('http://localhost:3000/api/files/preview', data, options)
      .pipe(
        tap((pdfBlob: Blob) => {
          const pdfUrl = URL.createObjectURL(pdfBlob);
          this.iframeSrc =
            this.sanitizer.bypassSecurityTrustResourceUrl(pdfUrl);
        })
      );
  }
  downloadPDF(filename: string): Observable<HttpResponse<Blob>> {
    return this.http.get(
      `http://localhost:3000/api/files/download/${filename}`,
      {
        observe: 'response',
        responseType: 'blob',
      }
    );
  }
  removePdf(filename: string): Observable<void> {
    return this.http.delete<void>(
      `http://localhost:3000/api/files/remove/${filename}`
    );
  }
}
