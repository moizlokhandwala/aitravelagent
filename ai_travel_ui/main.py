import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from ai_travel_ui.pages.register import register_page

if __name__ == "__main__":
    register_page().launch()