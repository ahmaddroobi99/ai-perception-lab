import { createFileRoute } from "@tanstack/react-router";
import { FrameworkLab } from "@/components/labs/FrameworkLab";

export const Route = createFileRoute("/_lab/pytorch")({
  component: () => (
    <FrameworkLab
      eyebrow="PyTorch"
      title="Tensors, modules, the forward pass"
      lede="PyTorch is a Python framework for defining neural nets and running them on CPU/GPU. It is not a detector. YOLO is often implemented *in* PyTorch."
      steps={[
        { title: "Dataset", body: "Images + labels. Augment. Collate into batches." },
        { title: "Tensor", body: "NCHW float32 on CUDA. Shape is a contract." },
        { title: "Forward", body: "model(x) → logits. No weights change." },
        { title: "Train (not here)", body: "loss → backward → optimizer.step() updates weights." },
      ]}
      compare={[
        { k: "What it is", v: "Framework (Python + autograd + CUDA)" },
        { k: "What it is not", v: "A model family like YOLO or a VLM" },
        { k: "This lab", v: "Does not execute Python. Mode B FastAPI would." },
        { k: "Typical file", v: "nn.Module, state_dict, .pt / .onnx export" },
      ]}
      honesty="A static Netlify/GitHub Pages host cannot run CUDA PyTorch. The live detector on this site is TensorFlow.js. To run Ultralytics YOLO, stand up localhost:8000 with FastAPI + torch and point Mode B at it."
      cta={{ to: "/architecture", label: "See Mode B architecture" }}
    />
  ),
});
