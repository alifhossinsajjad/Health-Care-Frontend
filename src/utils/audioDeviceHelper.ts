/**
 * Audio Device Helper
 * Intelligently prioritizes physical hardware microphones over virtual drivers (e.g. iVCam, Camo)
 */
export interface PreferredAudioDevice {
  deviceId?: string;
  label?: string;
}

export const getPreferredAudioDevice = async (): Promise<PreferredAudioDevice> => {
  try {
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.enumerateDevices) {
      return {};
    }

    const devices = await navigator.mediaDevices.enumerateDevices();
    const audioInputs = devices.filter((d) => d.kind === "audioinput");
    if (audioInputs.length === 0) return {};

    // Filter out silent/disconnected virtual drivers (e2eSoft iVCam, Camo, Stereo Mix, DroidCam)
    const physicalMic = audioInputs.find(
      (d) => d.label && !/ivcam|camo|virtual|droidcam|stereo mix/i.test(d.label)
    );

    if (physicalMic && physicalMic.deviceId) {
      return { deviceId: physicalMic.deviceId, label: physicalMic.label };
    }

    const fallback = audioInputs[0];
    return { deviceId: fallback?.deviceId, label: fallback?.label };
  } catch (err) {
    console.warn("Could not enumerate audio devices:", err);
    return {};
  }
};

export const acquirePhysicalMicStream = async (
  preferred: PreferredAudioDevice
): Promise<MediaStream> => {
  const baseAudio = { echoCancellation: true, noiseSuppression: true, autoGainControl: true };

  try {
    return await navigator.mediaDevices.getUserMedia({
      audio: preferred.deviceId ? { ...baseAudio, deviceId: { exact: preferred.deviceId } } : baseAudio,
    });
  } catch {
    try {
      return await navigator.mediaDevices.getUserMedia({
        audio: preferred.deviceId ? { ...baseAudio, deviceId: { ideal: preferred.deviceId } } : baseAudio,
      });
    } catch {
      return await navigator.mediaDevices.getUserMedia({ audio: true });
    }
  }
};
