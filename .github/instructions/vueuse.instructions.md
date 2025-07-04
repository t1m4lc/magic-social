---
applyTo: "**/*.vue,**/*.ts,**/*composable*.*"
---
# VueUse Functions Usage Guidelines

## When to Use State Management Functions

- Use **createGlobalState** when you need to share state across multiple Vue instances or outside of components
- Use **createInjectionState** when you want to create and inject state with proper TypeScript typing
- Choose **createSharedComposable** to convert a regular composable into one that shares the same state across component instances
- Apply **useLocalStorage**/**useSessionStorage** for persisting state in browser storage with reactivity
- Use **useStorage** as a unified API for both localStorage and sessionStorage
- Use **useAsyncState** when working with async data sources that need to be stored reactively
- Choose **useRefHistory** when you need to track changes to a ref, with undo/redo capabilities
- Use **useLastChanged** to track when a ref was last modified (timestamp)

## When to Use Element Functions

- Use **useElementBounding** to reactively track an element's position and size
- Choose **useElementSize** when you only need to track width/height changes
- Use **useElementVisibility** for implementing lazy loading or visibility-dependent behaviors
- Apply **useIntersectionObserver** for advanced viewport intersection detection (infinite scrolling, etc.)
- Use **useDraggable** for implementing drag and drop functionality
- Choose **useDropZone** when implementing file upload areas
- Use **useResizeObserver** to react to element size changes without window resize events
- Apply **useMutationObserver** when you need to watch for DOM changes

## When to Use Browser Functions

- Use **useEventListener** as the foundation for all DOM event handling
- Choose **useDark** for implementing dark/light mode with automatic persistence
- Use **useMediaQuery** for responsive logic based on media queries
- Apply **useBreakpoints** for consistent responsive breakpoint detection
- Use **useScriptTag** for dynamically loading external scripts
- Choose **usePreferredLanguages** for internationalization based on user preferences
- Use **useClipboard** for implementing copy/paste functionality
- Apply **useFullscreen** for toggling fullscreen mode
- Use **useTitle** to reactively update the document title
- Choose **useUrlSearchParams** for working with URL query parameters
- Use **useColorMode** when you need multiple color modes beyond just dark/light

## When to Use Sensor Functions

- Use **onClickOutside** for detecting clicks outside a specific element (dropdowns, modals)
- Apply **onKeyStroke** for keyboard shortcut implementation
- Use **onLongPress** for detecting long press gestures
- Choose **useMouse** for tracking mouse position
- Use **useScroll** for implementing scroll-based animations or behaviors
- Apply **useIdle** for detecting user inactivity
- Use **useGeolocation** when building location-aware applications
- Choose **useOnline** for tracking network connectivity status
- Use **useFocus**/**useFocusWithin** for accessibility and focus management
- Apply **useInfiniteScroll** for implementing endless scrolling lists
- Use **useSwipe**/**usePointerSwipe** for touch and pointer-based swipe detection

## When to Use Network Functions

- Use **useFetch** for making HTTP requests with reactivity and abort control
- Choose **useWebSocket** for real-time communication with WebSocket servers
- Use **useEventSource** for server-sent events (SSE) implementations

## When to Use Animation Functions

- Use **useInterval**/**useIntervalFn** for repeated actions at fixed time intervals
- Choose **useTimeout**/**useTimeoutFn** for delayed one-time actions
- Use **useTransition** for smooth value transitions
- Apply **useRafFn** for frame-by-frame animations
- Use **useNow**/**useTimestamp** for reactive current time

## When to Use Component Functions

- Use **useVModel** for simplified v-model binding in components
- Choose **useVModels** for handling multiple v-model bindings
- Use **unrefElement** to safely access DOM elements from refs
- Apply **tryOnMounted**/**tryOnUnmounted** for safe lifecycle hooks
- Use **useVirtualList** for rendering large lists with virtualization
- Choose **useTemplateRefsList** when working with refs in v-for loops

## When to Use Watch Functions

- Use **until** for waiting until a condition becomes truthy
- Choose **watchDebounced** to delay reaction to rapidly changing values
- Use **watchThrottled** to limit the frequency of reactions
- Apply **watchPausable** when you need to temporarily disable watchers
- Use **whenever** as a more readable alternative to watching for truthy values
- Choose **watchWithFilter** for advanced control over when watchers trigger

## When to Use Utility Functions

- Use **useToggle** for boolean state toggling
- Choose **useCounter** for numeric counters with increment/decrement
- Use **useDateFormat**/**useTimeAgo** for date/time formatting
- Apply **useConfirmDialog** for confirmation dialogs
- Use **useCloned** to work with reactive deep copies
- Choose **useDebounceFn**/**useThrottleFn** for limiting function call rates
- Use **useEventBus** for component communication without prop drilling
- Apply **useCycleList** for cycling through options (like carousel controls)

## Best Practices

- Check SSR compatibility when using browser-specific functions
- Use appropriate cleanup in component unmount hooks
- Prefer VueUse functions over custom implementations for consistency
- Combine multiple composables to create complex behaviors
- Check the return values to understand what properties and methods are available
- Consider performance implications, especially for DOM-intensive operations
