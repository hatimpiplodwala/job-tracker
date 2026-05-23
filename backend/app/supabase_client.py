from supabase import Client, create_client

from app.config import get_settings


def get_user_client(access_token: str) -> Client:
    """Return a Supabase client scoped to the user's JWT so RLS applies."""
    settings = get_settings()
    client = create_client(settings.supabase_url, settings.supabase_anon_key)
    client.postgrest.auth(access_token)
    return client
