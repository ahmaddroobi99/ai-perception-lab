import { createFileRoute } from "@tanstack/react-router";
import { FrameworkLab } from "@/components/labs/FrameworkLab";

export const Route = createFileRoute("/_lab/tensorflow")({
  component: () => (
    <FrameworkLab
      eyebrow="TensorFlow"
      title="Graphs, Keras, and TensorFlow.js"
      lede="TensorFlow is a framework. TensorFlow.js is the JavaScript runtime used by the live COCO-SSD detector in this lab. A Python .h5 does not automatically run in Chrome."
      steps={[
        { title: "Input", body: "tf.Tensor from pixels, usually float [0,1] or [-1,1]." },
        { title: "SavedModel / TFJS", body: "Export or convert. Layers vs graph models." },
        { title: "Inference", body: "model.predict / model.execute. WebGL or CPU backend." },
        { title: "Prediction", body: "Decode boxes or softmax. Dispose tensors or you leak GPU memory." },
      ]}
      compare={[
        { k: "Python TF", v: "Training + TF Serving in datacenters" },
        { k: "TF.js", v: "What this lab actually executes" },
        { k: "PyTorch", v: "Different framework, same math" },
        { k: "YOLO", v: "Usually PyTorch first, sometimes exported to TF/TFLite" },
      ]}
      honesty="The live camera path loads @tensorflow-models/coco-ssd in the browser. If WebGL fails we fall back to a motion proxy labeled Simulation."
      cta={{ to: "/camera", label: "Run the TFJS detector" }}
    />
  ),
});
