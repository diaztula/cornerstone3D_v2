import getTagValue from './getTagValue';
function getFrameInformation(PerFrameFunctionalGroupsSequence, SharedFunctionalGroupsSequence, frameNumber) {
    const shared = (SharedFunctionalGroupsSequence
        ? Object.values(SharedFunctionalGroupsSequence[0])
        : [])
        .map((it) => it[0])
        .filter((it) => it !== undefined && typeof it === 'object');
    const perFrame = (PerFrameFunctionalGroupsSequence
        ? Object.values(PerFrameFunctionalGroupsSequence[frameNumber - 1])
        : [])
        .map((it) => it.Value[0])
        .filter((it) => it !== undefined && typeof it === 'object');
    return {
        shared,
        perFrame,
    };
}
function getMultiframeInformation(metaData) {
    let { 52009230: PerFrameFunctionalGroupsSequence, 52009229: SharedFunctionalGroupsSequence, '00280008': NumberOfFrames, ...rest } = metaData;
    PerFrameFunctionalGroupsSequence = getTagValue(PerFrameFunctionalGroupsSequence, false);
    SharedFunctionalGroupsSequence = getTagValue(SharedFunctionalGroupsSequence, false);
    NumberOfFrames = getTagValue(NumberOfFrames);
    return {
        PerFrameFunctionalGroupsSequence,
        SharedFunctionalGroupsSequence,
        NumberOfFrames,
        rest,
    };
}
function combineFrameInstance(frameNumber, instance) {
    const { PerFrameFunctionalGroupsSequence, SharedFunctionalGroupsSequence, NumberOfFrames, rest, } = getMultiframeInformation(instance);
    if (PerFrameFunctionalGroupsSequence || NumberOfFrames > 1) {
        const { shared, perFrame } = getFrameInformation(PerFrameFunctionalGroupsSequence, SharedFunctionalGroupsSequence, frameNumber);
        const newInstance = Object.assign(instance, { frameNumber });
        [...shared, ...perFrame].forEach((item) => {
            Object.entries(item).forEach(([key, value]) => {
                newInstance[key] = value;
            });
        });
        return Object.assign(rest, { '00280008': NumberOfFrames }, newInstance);
    }
    return instance;
}
export { combineFrameInstance, getMultiframeInformation, getFrameInformation };
