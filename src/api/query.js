import { db } from '../config/firebase';

const { useEffect } = require('react');
const { useState } = require('react');

export const useFirestore = (query, transform, listen = false) => {
    const [{ data, loading, error }, setState] = useState({
        loading: true,
        error: null,
        data: null,
    });
    useEffect(() => {
        const setData = (result) => {
            setState({
                data: transform(result),
                loading: false,
            });
        };
        if (listen) {
            const unsub = query.onSnapshot(setData, (error) => {
                setState({
                    loading: false,
                    error,
                });
            });
            return () => {
                unsub();
            };
        } else {
            query
                .get()
                .then(setData)
                .catch((error) =>
                    setState({
                        loading: false,
                        error,
                    }),
                );
        }
    }, []);
    return [data, loading, error];
};

export const transformDoc = (data) => (data.exists ? { id: data.id, ...data.data() } : null);
export const transformCollection = (snapshot) =>
    snapshot.docs.map((item) => {
        return transformDoc(item);
    });

export const useCollection = (query) => useFirestore(query, transformCollection);

export const useDoc = (query) => useFirestore(query, transformDoc);

export const useRealtimeCollection = (query) => useFirestore(query, transformCollection, true);

export const useRealtimeDoc = (query) => useFirestore(query, transformDoc, true);

export const batchUpdate = async (collectionRef, data) => {
    const batch = db.batch();
    const snap = await collectionRef.get();
    snap.docs.forEach(({ id }) => {
        batch.update(collectionRef.doc(id), data);
    });
    await batch.commit();
};
