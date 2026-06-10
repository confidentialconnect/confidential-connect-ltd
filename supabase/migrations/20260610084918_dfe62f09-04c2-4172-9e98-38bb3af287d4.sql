
CREATE POLICY "Users can read own delivered documents"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'delivered-documents'
  AND (auth.uid()::text = (storage.foldername(name))[1] OR public.has_role(auth.uid(), 'admin'))
);

CREATE POLICY "Admins can upload delivered documents"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'delivered-documents' AND public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins can update delivered documents"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'delivered-documents' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete delivered documents"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'delivered-documents' AND public.has_role(auth.uid(), 'admin'));
