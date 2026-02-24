from abc import ABC, abstractmethod
from schemas import BlogContent

class SiteConnector(ABC):
    @abstractmethod
    def connect(self):
        """Establish connection to the target site."""
        pass

    @abstractmethod
    def format_payload(self, content: BlogContent):
        """Format the Gemini content to the target site's schema."""
        pass

    @abstractmethod
    def inject(self, payload: dict):
        """Inject the content into the target site's database/API."""
        pass
