import React, { useRef, useState } from 'react'
import { useLayoutEffect } from './useLayoutEffect';

const useTableDimensions = () => {

	const gridRef = useRef(null);
	const [inlineSize, setInlineSize] = useState(1);
	const [blockSize, setBlockSize] = useState(1);
	const [isWidthInitialized, setWidthInitialized] = useState(false);

	useLayoutEffect(() => {
		const { ResizeObserver } = window;

		if (ResizeObserver == null) return;

		const { clientWidth, clientHeight, offsetWidth, offsetHeight } = gridRef.current;
		const { width, height } = gridRef.current.getBoundingClientRect();
		const initialWidth = width - offsetWidth + clientWidth;
		const initialHeight = height - offsetHeight + clientHeight;

		setInlineSize(initialWidth);
		setBlockSize(initialHeight);
		setWidthInitialized(true);

		const resizeObserver = new ResizeObserver((entries) => {
			const size = entries[0].contentBoxSize[0];
			setInlineSize(size.inlineSize);
			setBlockSize(size.blockSize);
		});
		resizeObserver.observe(gridRef?.current);

		return () => {
			resizeObserver.disconnect();
		};
	}, []);

	return [gridRef, inlineSize, blockSize, isWidthInitialized];
}

export default useTableDimensions