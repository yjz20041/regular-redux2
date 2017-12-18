import bindStore from './bindstore';
export default (
    mapStateToData, mapDispatchToData, store
) => App => App.extend(Object.assign({
    mapStateToData,
    mapDispatchToData,
    store
}, bindStore))