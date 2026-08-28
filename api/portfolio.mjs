const jsonHeaders = {
  'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
  'Content-Type': 'application/json; charset=utf-8'
};

export default {
  async fetch() {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    const folder = process.env.CLOUDINARY_PORTFOLIO_FOLDER || 'anteye-photos';

    if (!cloudName || !apiKey || !apiSecret) {
      return Response.json(
        { error: 'Portfolio service is not configured.' },
        { status: 503, headers: jsonHeaders }
      );
    }

    try {
      const credentials = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64');
      const endpoint = `https://api.cloudinary.com/v1_1/${encodeURIComponent(cloudName)}/resources/search`;
      const cloudinaryResponse = await fetch(endpoint, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${credentials}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          expression: `asset_folder:${JSON.stringify(folder)}`,
          sort_by: [{ created_at: 'desc' }],
          max_results: 100
        })
      });

      if (!cloudinaryResponse.ok) {
        throw new Error(`Cloudinary responded with ${cloudinaryResponse.status}`);
      }

      const payload = await cloudinaryResponse.json();
      const images = (payload.resources || [])
        .filter((asset) => asset.secure_url)
        .map((asset) => ({
          src: asset.secure_url.replace('/upload/', '/upload/f_auto,q_auto,w_1600/'),
          alt: asset.context?.custom?.alt || 'Photography by Ant-Eye Studio'
        }));

      return Response.json({ images }, { headers: jsonHeaders });
    } catch (error) {
      console.error('Unable to load the Cloudinary portfolio:', error);
      return Response.json(
        { error: 'Unable to load the portfolio right now.' },
        { status: 502, headers: jsonHeaders }
      );
    }
  }
};
