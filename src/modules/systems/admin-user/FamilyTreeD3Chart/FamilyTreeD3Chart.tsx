"use client"

import type React from "react"
import { useRef, useEffect, useState, useCallback } from "react"
import * as d3 from "d3"
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react"
import styles from "./family-tree.module.scss"

interface Person {
  id: string
  user_id: string
  name: string
  status: string
  birth_hour?: number
  birth_minute?: number
  birth_day?: number
  birth_month?: number
  birth_year?: number
  death_hour?: number
  death_minute?: number
  death_day?: number
  death_month?: number
  death_year?: number
  gender: string
  description?: string
  generation: number
  photo?: string | null
  parent_id?: string | null
  active_flag: number
  children?: Person[]
  spouses?: Person[]
}

interface Marriage {
  id: string
  user_id: string
  husband_id: string
  wife_id: string
  marriage_date?: string
  active_flag: number
}

interface TraditionalFamilyTreeProps {
  persons?: Person[]
  marriages?: Marriage[]
  searchValue?: string
  onPersonSelect?: (person: Person | null) => void
  onAddChild?: (parentId: string) => void
  onEditPerson?: (personId: string) => void
  onAddSpouse?: (personId: string) => void
}

const TraditionalFamilyTree: React.FC<TraditionalFamilyTreeProps> = ({
  persons = [],
  marriages = [],
  searchValue = "",
  onPersonSelect = () => {},
  onAddChild = () => {},
  onEditPerson = () => {},
  onAddSpouse = () => {},
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null)
  const zoomBehaviorRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null)
  const [zoomLevel, setZoomLevel] = useState(1)

  const actualPersons = persons
  const actualMarriages = marriages

  const buildHierarchicalData = useCallback(() => {
    const personMap = new Map<string, Person>()
    actualPersons.forEach((p) => personMap.set(p.id, { ...p, spouses: [], children: [] }))

    actualMarriages.forEach((m) => {
      const husband = personMap.get(m.husband_id)
      const wife = personMap.get(m.wife_id)
      if (husband && wife) {
        husband.spouses = husband.spouses || []
        if (!husband.spouses.some((s) => s.id === wife.id)) husband.spouses.push(wife)
        wife.spouses = wife.spouses || []
        if (!wife.spouses.some((s) => s.id === husband.id)) wife.spouses.push(husband)
      }
    })

    const dataNodes: Person[] = []
    personMap.forEach((p) => {
      if (p.parent_id) {
        const parent = personMap.get(p.parent_id)
        if (parent) {
          parent.children = parent.children || []
          if (!parent.children.some((c) => c.id === p.id)) parent.children.push(p)
        }
      } else {
        dataNodes.push(p)
      }
    })

    return dataNodes
  }, [actualPersons, actualMarriages])

  useEffect(() => {
    if (!svgRef.current) return

    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove()

    let width = svgRef.current.clientWidth
    const height = svgRef.current.clientHeight

    const defs = svg.append("defs")
    const goldGradient = defs
      .append("linearGradient")
      .attr("id", "goldGradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "100%")
      .attr("y2", "100%")
    goldGradient.append("stop").attr("offset", "0%").attr("stop-color", "#FFD700").attr("stop-opacity", 1)
    goldGradient.append("stop").attr("offset", "50%").attr("stop-color", "#B8860B").attr("stop-opacity", 0.8)
    goldGradient.append("stop").attr("offset", "100%").attr("stop-color", "#DAA520").attr("stop-opacity", 1)
    svg.append("rect").attr("width", "100%").attr("height", "100%").attr("fill", "url(#goldGradient)")

    const margin = { top: 80, right: 100, bottom: 80, left: 100 }
    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`)

    const treeData = buildHierarchicalData()
    const treeLayout = d3.tree<Person>().nodeSize([200, 180])

    let rootNode: d3.HierarchyPointNode<Person>
    if (treeData.length === 1) {
      rootNode = treeLayout(d3.hierarchy(treeData[0]))
    } else {
      rootNode = treeLayout(
        d3.hierarchy({
          id: "root-placeholder",
          name: "Gốc Gia Phả",
          generation: 0,
          gender: "unknown",
          status: "unknown",
          active_flag: 1,
          user_id: "system",
          children: treeData,
        } as Person),
      )
    }

    const nodes = rootNode
    const cardWidth = 160
    const cardHeight = 200
    const minNodeSpacing = 100 // Khoảng cách tối thiểu giữa các node

    const generations = new Map<number, Person[]>()
    nodes.descendants().forEach((node) => {
      if (node.data.id === "root-placeholder") return
      const gen = node.data.generation
      if (!generations.has(gen)) generations.set(gen, [])
      generations.get(gen)!.push(node.data)
    })

    Array.from(generations.keys())
      .sort()
      .forEach((genLevel, genIndex) => {
        const people = generations.get(genLevel)!

        const familyGroups = new Map<string, Person[]>()
        const singlePeople: Person[] = []

        people.forEach((person) => {
          if (person.parent_id) {
            const parentKey = person.parent_id
            if (!familyGroups.has(parentKey)) familyGroups.set(parentKey, [])
            familyGroups.get(parentKey)!.push(person)
          } else {
            singlePeople.push(person)
          }
        })

        let currentX = 0

        if (singlePeople.length > 0) {
          singlePeople.forEach((person, index) => {
            const node = nodes.descendants().find((n) => n.data.id === person.id)
            if (!node) return

            node.x = currentX
            node.y = genIndex * 300

            let nextX = currentX + cardWidth + minNodeSpacing

            if (person.gender === "male" && person.spouses?.length) {
              person.spouses.forEach((spouse) => {
                const spouseNode = nodes.descendants().find((n) => n.data.id === spouse.id)
                if (spouseNode) {
                  spouseNode.x = nextX
                  spouseNode.y = genIndex * 300
                  nextX += cardWidth + minNodeSpacing
                }
              })
            }

            currentX = nextX
          })
        }

        familyGroups.forEach((siblings, parentId) => {
          const parent = actualPersons.find((p) => p.id === parentId)
          if (!parent) return

          const parentNode = nodes.descendants().find((n) => n.data.id === parent.id)
          if (!parentNode) return

          let familyCenterX = parentNode ? parentNode.x! + cardWidth / 2 : 0
          const parentSpouses = actualMarriages
            .filter((m) => m.husband_id === parent.id || m.wife_id === parent.id)
            .map((m) => (m.husband_id === parent.id ? m.wife_id : m.husband_id))
          const allParentNodes = [parentNode]
          if (parentSpouses.length > 0) {
            const spouseNodes = parentSpouses
              .map((spouseId) => nodes.descendants().find((n) => n.data.id === spouseId))
              .filter((node) => !!node)
            allParentNodes.push(...spouseNodes)
            if (spouseNodes.length > 0) {
              const leftmostX = Math.min(...allParentNodes.map((n) => n!.x!))
              const rightmostX = Math.max(...allParentNodes.map((n) => n!.x! + cardWidth))
              familyCenterX = (leftmostX + rightmostX) / 2
            }
          }

          siblings.sort((a, b) => (a.gender === "male" && b.gender !== "male" ? -1 : a.gender !== "male" && b.gender === "male" ? 1 : 0))

          let totalWidth = 0
          siblings.forEach((sibling) => {
            totalWidth += cardWidth // Chiều rộng của node con
            if (sibling.spouses?.length) {
              totalWidth += sibling.spouses.length * (cardWidth + minNodeSpacing) // Chiều rộng của spouses
            }
            if (siblings.indexOf(sibling) < siblings.length - 1) totalWidth += minNodeSpacing // Khoảng cách giữa các con
          })

          let startX = familyCenterX - totalWidth / 2
          let currentSiblingX = startX

          siblings.forEach((sibling) => {
            const siblingNode = nodes.descendants().find((n) => n.data.id === sibling.id)
            if (!siblingNode) return

            siblingNode.x = currentSiblingX
            siblingNode.y = genIndex * 300

            currentSiblingX += cardWidth

            if (sibling.spouses?.length) {
              sibling.spouses.forEach((spouse) => {
                const spouseNode = nodes.descendants().find((n) => n.data.id === spouse.id)
                if (spouseNode) {
                  spouseNode.x = currentSiblingX
                  spouseNode.y = genIndex * 300
                  currentSiblingX += cardWidth + minNodeSpacing
                }
              })
            }

            if (siblings.indexOf(sibling) < siblings.length - 1) {
              currentSiblingX += minNodeSpacing // Đảm bảo khoảng cách giữa các con
            }
          })
        })
      })

    const allNodes = nodes.descendants().filter((d) => d.data.id !== "root-placeholder")
    if (allNodes.length > 0) {
      const minX = Math.min(...allNodes.map((d) => d.x || 0))
      const maxX = Math.max(...allNodes.map((d) => (d.x || 0) + cardWidth))
      const treeWidth = maxX - minX
      if (treeWidth > width - margin.left - margin.right) {
        width = treeWidth + margin.left + margin.right // Mở rộng chiều rộng SVG nếu cần
        svg.attr("width", width)
      }
      const offsetX = (width - margin.left - margin.right - treeWidth) / 2 - minX

      const minY = Math.min(...allNodes.map((d) => d.y || 0))
      const maxY = Math.max(...allNodes.map((d) => (d.y || 0) + cardHeight))
      const treeHeight = maxY - minY
      const offsetY = Math.max(50, (height - margin.top - margin.bottom - treeHeight) / 2 - minY)

      allNodes.forEach((node) => {
        node.x = (node.x || 0) + offsetX
        node.y = (node.y || 0) + offsetY
      })
    }

    g.selectAll(".parent-child-link")
      .data(nodes.descendants().filter((d) => d.data.parent_id && d.data.id !== "root-placeholder"))
      .enter()
      .append("path")
      .attr("class", "parent-child-link")
      .attr("fill", "none")
      .attr("stroke", "#CD853F")
      .attr("stroke-width", 3)
      .attr("d", (d) => {
        const parentNode = nodes.descendants().find((n) => n.data.id === d.data.parent_id)
        if (!parentNode) return ""

        const parent = actualPersons.find((p) => p.id === d.data.parent_id)
        if (!parent) return ""

        let parentCenterX = parentNode.x! + cardWidth / 2
        const parentSpouses = actualMarriages
          .filter((m) => m.husband_id === parent.id || m.wife_id === parent.id)
          .map((m) => (m.husband_id === parent.id ? m.wife_id : m.husband_id))

        if (parentSpouses.length > 0) {
          const spouseNodes = parentSpouses
            .map((spouseId) => nodes.descendants().find((n) => n.data.id === spouseId))
            .filter((node) => !!node)
          if (spouseNodes.length > 0) {
            const allParentNodes = [parentNode, ...spouseNodes]
            const leftmostX = Math.min(...allParentNodes.map((n) => n!.x!))
            const rightmostX = Math.max(...allParentNodes.map((n) => n!.x! + cardWidth))
            parentCenterX = (leftmostX + rightmostX) / 2
          }
        }

        const childX = d.x! + cardWidth / 2
        const parentY = parentNode.y! + cardHeight
        const childY = d.y!

        return `M${parentCenterX},${parentY} L${parentCenterX},${parentY + 40} L${childX},${parentY + 40} L${childX},${childY}`
      })

    actualMarriages.forEach((marriage) => {
      const husbandNode = nodes.descendants().find((n) => n.data.id === marriage.husband_id)
      const wifeNode = nodes.descendants().find((n) => n.data.id === marriage.wife_id)
      if (husbandNode && wifeNode) {
        g.append("path")
          .attr("class", "marriage-link")
          .attr("fill", "none")
          .attr("stroke", "#FF6347")
          .attr("stroke-width", 3)
          .attr(
            "d",
            `M${husbandNode.x! + cardWidth},${husbandNode.y! + cardHeight / 2} L${wifeNode.x!},${wifeNode.y! + cardHeight / 2}`,
          )
      }
    })

    const node = g
      .selectAll(".node")
      .data(nodes.descendants().filter((d) => d.data.id !== "root-placeholder"))
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", (d) => `translate(${d.x || 0},${d.y || 0})`)
      .style("cursor", "pointer")
      .on("click", (event, d) => {
        event.stopPropagation()
        onPersonSelect(d.data)
      })

    node
      .append("foreignObject")
      .attr("width", cardWidth)
      .attr("height", cardHeight)
      .style("overflow", "visible")
      .html((d) => {
        const person = d.data
        const birthYear = person.birth_year ? `${person.birth_year}` : "?"
        const deathYear = person.death_year ? `${person.death_year}` : person.status === "alive" ? "" : "?"
        const yearInfo = person.status === "alive" ? `Sinh: ${birthYear}` : `${birthYear} - ${deathYear}`

        return `
          <div style="
            width: ${cardWidth}px;
            height: ${cardHeight}px;
            background: linear-gradient(145deg, #8B4513 0%, #A0522D 50%, #8B4513 100%);
            border: 3px solid #DAA520;
            border-radius: 8px;
            box-shadow: 
              0 4px 8px rgba(0,0,0,0.3),
              inset 0 1px 0 rgba(255,255,255,0.2),
              inset 0 -1px 0 rgba(0,0,0,0.2);
            position: relative;
            overflow: hidden;
          ">
            <div style="
              position: absolute;
              top: 8px;
              left: 8px;
              right: 8px;
              bottom: 8px;
              border: 2px solid #FFD700;
              border-radius: 4px;
              background: rgba(255,215,0,0.1);
            "></div>
            <div style="
              position: absolute;
              top: 12px;
              left: 12px;
              width: 16px;
              height: 16px;
              border-left: 2px solid #FFD700;
              border-top: 2px solid #FFD700;
            "></div>
            <div style="
              position: absolute;
              top: 12px;
              right: 12px;
              width: 16px;
              height: 16px;
              border-right: 2px solid #FFD700;
              border-top: 2px solid #FFD700;
            "></div>
            <div style="
              position: absolute;
              bottom: 12px;
              left: 12px;
              width: 16px;
              height: 16px;
              border-left: 2px solid #FFD700;
              border-bottom: 2px solid #FFD700;
            "></div>
            <div style="
              position: absolute;
              bottom: 12px;
              right: 12px;
              width: 16px;
              height: 16px;
              border-right: 2px solid #FFD700;
              border-bottom: 2px solid #FFD700;
            "></div>
            <div style="
              position: relative;
              z-index: 2;
              padding: 20px 12px;
              height: 100%;
              display: flex;
              flex-direction: column;
              align-items: center;
              text-align: center;
            ">
              <div style="
                width: 60px;
                height: 60px;
                border-radius: 50%;
                background: ${person.gender === "male" ? "linear-gradient(135deg, #87CEEB, #4682B4)" : "linear-gradient(135deg, #FFB6C1, #FF69B4)"};
                border: 3px solid #FFD700;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-bottom: 8px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.3);
              ">
                <div style="
                  width: 40px;
                  height: 40px;
                  background: ${person.gender === "male" ? "#4682B4" : "#FF69B4"};
                  border-radius: 50%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                ">
                  <div style="
                    width: 24px;
                    height: 30px;
                    background: ${person.gender === "male" ? "#87CEEB" : "#FFB6C1"};
                    border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
                    position: relative;
                  ">
                    <div style="
                      position: absolute;
                      bottom: -8px;
                      left: 50%;
                      transform: translateX(-50%);
                      width: 20px;
                      height: 12px;
                      background: ${person.gender === "male" ? "#87CEEB" : "#FFB6C1"};
                      border-radius: 50%;
                    "></div>
                  </div>
                </div>
              </div>
              <div style="
                font-weight: bold;
                font-size: 13px;
                color: #FFD700;
                margin-bottom: 4px;
                text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
                line-height: 1.2;
              ">
                ${person.name}
              </div>
              <div style="
                font-size: 11px;
                color: #F5DEB3;
                margin-bottom: 6px;
                text-shadow: 1px 1px 1px rgba(0,0,0,0.5);
              ">
                (${person.gender === "male" ? "Nam" : "Nữ"})<br/>
                Đời: ${person.generation}
              </div>
              <div style="
                font-size: 10px;
                color: #F5DEB3;
                margin-bottom: 8px;
                text-shadow: 1px 1px 1px rgba(0,0,0,0.5);
                line-height: 1.3;
              ">
                ${yearInfo}
              </div>
            </div>
          </div>
        `
      })

    ;(window as any).handleEditClick = (personId: string, event: Event) => {
      event.stopPropagation()
      onEditPerson(personId)
    }
    ;(window as any).handleAddChildClick = (parentId: string, event: Event, isMale: boolean) => {
      event.stopPropagation()
      onAddChild(parentId)
    }
    ;(window as any).handleAddSpouseClick = (personId: string, event: Event) => {
      event.stopPropagation()
      onAddSpouse(personId)
    }

    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 2])
      .on("zoom", (event) => {
        g.attr(
          "transform",
          `translate(${margin.left + event.transform.x},${margin.top + event.transform.y}) scale(${event.transform.k})`,
        )
        setZoomLevel(event.transform.k)
      })
    svg.call(zoom)
    zoomBehaviorRef.current = zoom

    return () => {
      ;(window as any).handleEditClick = null
      ;(window as any).handleAddChildClick = null
      ;(window as any).handleAddSpouseClick = null
    }
  }, [actualPersons, actualMarriages, buildHierarchicalData, onPersonSelect, onAddChild, onEditPerson, onAddSpouse])

  const handleResetZoom = () => {
    const svg = d3.select(svgRef.current)
    if (zoomBehaviorRef.current) {
      svg
        .transition()
        .duration(750)
        .call(zoomBehaviorRef.current.transform as any, d3.zoomIdentity)
      setZoomLevel(1)
    }
  }

  const handleZoomIn = () => {
    const svg = d3.select(svgRef.current)
    if (zoomBehaviorRef.current) {
      svg
        .transition()
        .duration(250)
        .call(zoomBehaviorRef.current.scaleBy as any, 1.2)
    }
  }

  const handleZoomOut = () => {
    const svg = d3.select(svgRef.current)
    if (zoomBehaviorRef.current) {
      svg
        .transition()
        .duration(250)
        .call(zoomBehaviorRef.current.scaleBy as any, 0.8)
    }
  }

  return (
    <div className={styles.container}>
      <svg ref={svgRef} className={styles.svg} />
      <div className={styles.zoomControls}>
        <div className={styles.zoomLevel}>Phóng to: {zoomLevel.toFixed(1)}x</div>
        <div className={styles.buttonGroup}>
          <button onClick={handleZoomIn} className={styles.zoomButton}>
            <ZoomIn size={16} />
          </button>
          <button onClick={handleZoomOut} className={styles.zoomButton}>
            <ZoomOut size={16} />
          </button>
          <button onClick={handleResetZoom} className={styles.zoomButton}>
            <RotateCcw size={16} />
          </button>
        </div>
      </div>
      {/* <div className={styles.title}>
        <h1 className={styles.titleText}>🏮 CÂY GIA PHẢ TRUYỀN THỐNG 🏮</h1>
        <p className={styles.subtitle}>Dòng họ Nguyễn - Truyền thống nghìn năm</p>
      </div> */}
    </div>
  )
}

export default TraditionalFamilyTree

