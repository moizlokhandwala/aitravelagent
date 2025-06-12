import gradio as gr
from ai_travel_ui.utils.auth import register_user

def register_page():
    with gr.Blocks() as page:
        gr.Markdown("## ✨ Register for WanderBuddy")

        with gr.Row():
            with gr.Column(scale=1):
                gr.Markdown("")  # spacing
            with gr.Column(scale=2):
                email = gr.Textbox(label="📧 Email", placeholder="Enter your email")
                password = gr.Textbox(label="🔒 Password", placeholder="Choose a password", type="password")

                register_btn = gr.Button("Register", variant="primary")
                status = gr.Markdown()

                register_btn.click(fn=register_user, inputs=[email, password], outputs=status)

            with gr.Column(scale=1):
                gr.Markdown("")  # spacing
    return page
