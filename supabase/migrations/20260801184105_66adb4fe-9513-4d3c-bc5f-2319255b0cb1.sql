DROP POLICY IF EXISTS "Product images public read" ON storage.objects;

CREATE POLICY "Product images public direct read"
ON storage.objects
FOR SELECT
TO anon, authenticated
USING (
  bucket_id = 'product-images'
  AND (storage.foldername(name))[1] IS NOT NULL
);