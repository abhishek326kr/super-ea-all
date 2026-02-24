from .site_connector import SiteConnector
from schemas import BlogContent

class YoForexAdapter(SiteConnector):
    def connect(self):
        # Implementation for WP REST API or Direct DB connection
        print("Connecting to YoForex WordPress...")
        return True

    def format_payload(self, content: BlogContent):
        # Map BlogContent to wp_posts schema
        return {
            "post_title": content.h1,
            "post_content": content.body_html,
            "post_status": "draft",
            "meta_input": {
                "_yoast_wpseo_title": content.meta_title,
                "_yoast_wpseo_metadesc": content.meta_description,
                "faq_schema": content.faq_schema_json
            }
        }

    def inject(self, payload: dict):
        # Mocking SQL/API injection
        print(f"Injecting into YoForex: {payload['post_title']}")
        return {"status": "success", "site": "YoForex"}
