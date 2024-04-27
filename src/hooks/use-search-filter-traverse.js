export const useSearchFilterTraverse = (data, searchValue) => {
    const traverse = (data, searchValue) => {
        return data.reduce((acc, item) => {
        if (item.children) {
            const children = traverse(item.children, searchValue);
            if (children.length) {
            acc.push({ ...item, children });
            }
        } else if (item.name.toLowerCase().includes(searchValue.toLowerCase())) {
            acc.push(item);
        }
        return acc;
        }, []);
    };
    
    return traverse(data, searchValue);
    }

// export default useSearchFilterTraverse;

// explain code : 

// use DP to optimize the code
export const useDPSearchFilterTraverse = (data, searchValue) => {
    const traverse = (data, searchValue, memo = {}) => {
        if (memo[searchValue]) {
            return memo[searchValue];
        }
        const result = data.reduce((acc, item) => {
            if (item.children) {
                const children = traverse(item.children, searchValue, memo);
                if (children.length) {
                    acc.push({ ...item, children });
                }
            } else if (item.name.toLowerCase().includes(searchValue.toLowerCase())) {
                acc.push(item);
            }
            return acc;
        }, []);
        memo[searchValue] = result;
        return result;
    };
    
    return traverse(data, searchValue);
};