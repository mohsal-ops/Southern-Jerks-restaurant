declare namespace H {
  namespace service {
    class Platform {
      constructor(opts: { apikey: string })
      createDefaultLayers(): any
    }

    class SearchService {
      geocode(
        params: any,
        onResult: (result: any) => void,
        onError: (err: any) => void
      ): void
    }
  }

  namespace map {
    class Marker {
      constructor(position: { lat: number; lng: number })
      addEventListener(event: string, cb: Function): void
    }
  }

  namespace mapevents {
    class Behavior {
      constructor(events: any)
    }

    class MapEvents {
      constructor(map: any)
    }
  }

  namespace ui {
    class UI {
      static createDefault(map: any, layers: any): UI
      addBubble(bubble: any): void
    }

    class InfoBubble {
      constructor(pos: any, opts: any)
    }
  }

  namespace geo {
    class Rect {
      constructor(t: number, r: number, b: number, l: number)
      mergePoint(p: any): void
    }
  }

  class Map {
    constructor(el: HTMLElement, layer: any, opts: any)
    getCenter(): { lat: number; lng: number }
    getViewModel(): any
    addObject(obj: any): void
    removeObject(obj: any): void
  }
}
