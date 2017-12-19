import bindStore from './bindstore';
export default (
    mapStateToData, mapDispatchToData, extra={}
) => App => {
return App.extend(Object.assign({
    mapStateToData,
    mapDispatchToData
}, extra, bindStore))
}